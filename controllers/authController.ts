import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from 'bcryptjs';
import { userModel } from '../config/AppContext';
import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/apiError";
import { sendEmail } from "../utils/sendEmail";

class AuthController {

    async signup(req: Request, res: Response, next: NextFunction) {
        //1-create user
        const user = await userModel.createUser({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });

        //2-generate tokken
        const jwt_key = process.env.JWT_SECRET_KEY as string;

        const token = jwt.sign(
            { data: user._id.toString() },
            jwt_key,
            { expiresIn: '90d' }
        );

        res.status(201).json({ data: user, token })
    }

    async logIn(req: Request, res: Response, next: NextFunction) {
        const { email, password } = req.body;

        const user = await userModel.getUserByEmail(email);



        if (!user || !(await bcrypt.compare(password, user.password))) {
            return next(new ApiError(401, "email or password is incorrect"));
        }

        //2-generate tokken
        const jwt_key = process.env.JWT_SECRET_KEY as string;

        const token = jwt.sign(
            { data: user._id.toString() },
            jwt_key,
            { expiresIn: '90d' }
        );

        res.status(201).json({ data: user, token })
    }

    //@desc this function check athentication
    async protectedRoute(req: Request, res: Response, next: NextFunction) {
        //1-check if tokken exist
        const tokken = req.headers.authorization?.split(' ')[1] as string;

        if (!tokken) {
            return next(new ApiError(401, "unauthorized user"));
        }

        // 2- verify token (no change, no expire)
        let payload: any;
        try {
            payload = jwt.verify(tokken, process.env.JWT_SECRET_KEY as string);
        } catch (err) {
            return next(new ApiError(401, "unauthorized user"));
        }

        //3-check if user exist
        const user = await userModel.getUserById(payload.data.toString());

        if (!user) {
            return next(new ApiError(401, "this no longer exist"));
        }

        //4-check if user change has password
        if (user.passwordChangedAt) {
            const changedTimeStamp = Math.floor(user.passwordChangedAt.getTime() / 1000);

            if (changedTimeStamp > payload.iat) {
                return next(new ApiError(401, "password changed please login again"));
            }
        }

        //5- set user in req
        req.user = user;

        next();
    }

    //@desc this function check athirization
    allowedRoles(...roles: string[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            if (!roles.includes(req.user.role)) {
                return next(new ApiError(403, "You are not allowed to access this route"));
            }
            next();
        }
    }

    async forgetPassword(req: Request, res: Response, next: NextFunction) {
        //1-check if user exist by email
        const email = req.body.email;
        const user = await userModel.getUserByEmail(email);

        if (!user) {
            return next(new ApiError(404, "this user not found"));
        }
        //2-generate random 6 digits number
        const otp = Math.floor(100000 + Math.random() * 9000000).toString() ;

        //3-hash otp
        const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
        

        user.otp = hashedOtp;
        user.otpExpireAt = new Date(Date.now() + 10 * 60 * 1000);
        user.otpVerified = false;

        //4-store otp in db
        await user.save();

        //5-send otp to user email
        const message = `Hi ${user.name}\n your password reset code is ${otp}`;
        try {
            await sendEmail({
                email: user.email,
                subject: "password reset code for your account",
                message
            });
        } catch (err) {
            user.otp = undefined;
            user.otpExpireAt = undefined;
            user.otpVerified = false;

            await user.save();

            return next(new ApiError(500, "something went wrong, email not sent"));
        }

        res.status(200).json({ status: "success", message: "otp sent to your email" });
    }
    
    async verifyOtp(req: Request, res: Response, next: NextFunction) {
        //1-check if user exist 
        const otp = req.body.otp;
        const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
        
        const user = await userModel.getUserByOtp(hashedOtp);

        if (!user) {
            return next(new ApiError(400, "reset code is ivalid or expired"));
        }

        user.otpVerified = true;
        await user.save();

        res.status(200).json({ status: "success", message: "otp verified" });
    }

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        //1-check if user exist 
        const email = req.body.email;
        const newPassword = req.body.newPassword;
        const user = await userModel.getUserByEmail(email);

        if (!user) {
            return next(new ApiError(404, "this user not found"));
        }

        if(user.otpVerified === false) {
            return next(new ApiError(400, "reset code is not verified yet"));
        }

        //2-hash password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        //3-update password in db
        user.password = hashedPassword;
        user.otp = undefined;
        user.otpExpireAt = undefined;
        user.otpVerified = false;

        await user.save();

        //2-generate tokken
        const jwt_key = process.env.JWT_SECRET_KEY as string;

        const tokken = jwt.sign(
            { data: user._id.toString() },
            jwt_key,
            { expiresIn: '90d' }
        );


        res.status(200).json({ status: "success", tokken: tokken });
    }
}

export { AuthController }