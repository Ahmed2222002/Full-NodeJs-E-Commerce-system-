import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { getMongooseQueryFromRequest } from "../utils/apiFeatures";
import { IUser } from "../interfaces/userInterface";


class UsersModel {
    private userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: [true, "User name is required"],
            minLength: [3, "Too short user name"],
            maxLength: [32, "Too long user name"],
        },
        slug: {
            type: String,
            lowercase: true,
        },
        emailVerified: {
            type: Boolean,
            default: false
        },
        email: {
            type: String,
            required: [true, "User email is required"],
            unique: [true, "email is already in exist"],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please add a valid email",
            ],
        },
        phone: {
            type: String,
            sparse: true,
            unique: [true, "phone is already in exist"],
        },
        image: String,
        password: {
            type: String,
            required: [true, "User password is required"],
            min: [6, "Too short password"],
        },
        passwordChangedAt: Date,
        otp: String,
        otpExpireAt: Date,
        otpVerified: Boolean,
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        active: {
            type: Boolean,
            default: true,
        },
        wishList: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
        addresses:[
            {
                id: {type:mongoose.Schema.Types.ObjectId},
                alias: String,
                details: String,
                phone: String,
                city: String,
                postalCode: String
            }
        ]
    },
        {
            timestamps: true,
        });
    private userModel;
    constructor() {
        this.userSchema.set('toJSON', {
            transform: function (doc, ret) {
                if (ret.image) {
                    ret.image = `${process.env.BASE_URL}/users/${ret.image}`;
                }
                return ret;
            },
        });

        this.userSchema.pre("save", async function (next) {
            if (!this.isModified("password")) return next();
            this.password = await bcrypt.hash(this.password, 12);
            next();
        });

        this.userModel = mongoose.model("User", this.userSchema);

        this.userModel.syncIndexes()
            .then(() => console.log("indexes synced"))
            .catch((err) => console.error(err));

    }

    getUserModel() {
        return this.userModel;
    }

    createUser(user: IUser) {
        return this.userModel.create(user);
    }

    getUser(filters: any) {
        return getMongooseQueryFromRequest(this.userModel, filters);
    }

    getUserById(id: string) {
        return this.userModel.findById(id);
    }

    getUserByEmail(email: string) {
        return this.userModel.findOne({ email });
    }

    getUserByOtp(otphash: string) {
        return this.userModel.findOne({ otp: otphash, otpExpireAt: { $gt: Date.now() } });
    }

    async updateUser(id: string, newBody: any): Promise<Document | { error: string } | null> {

        return this.userModel.findOneAndUpdate({ _id: id }, {
            name: newBody?.name,
            slug: newBody?.slug,
            phone: newBody?.phone,
            image: newBody?.image,
            role: newBody?.role,
            active: newBody?.active,

        },
            { new: true });
    }

    async changePassword(id: string, newPassword: string, currentPassword: string) {
        const user = await this.userModel.findById(id);
        if (!user) {
            return "user not found";
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return "current password is incorrect";
        }
        newPassword = await bcrypt.hash(newPassword, 12);
        return this.userModel.findOneAndUpdate({ _id: id }, { password: newPassword, passwordChangedAt: Date.now() }, { new: true });
    }

    deleteUser(id: string) {
        return this.userModel.findByIdAndDelete({ _id: id });
    }
}

export { UsersModel };