import { Request, Response , NextFunction} from "express";
import { UsersModel } from "../models/usersModel";
import { IUser } from "../interfaces/userInterface";
import slugify from "slugify";
import { ApiError } from "../utils/apiError";
import qs from "qs";

class UserController {

    private userModel: UsersModel;

    constructor(userModel: UsersModel) {
        this.userModel = userModel
    }

    // @desc Create new user
    // @route POST api/v1/Users
    // @access Private
    async createUser(req: Request, res: Response) {
        const name = req.body.name;
        const user: IUser = {
            name, 
            email: req.body.email,
            slug: slugify(name),
            phone: req.body.phone,
            image: req.body.image, 
            password: req.body.password,
            role: req.body.role,
            active: true
        };
        const response = await this.userModel.createUser(user);
        res.status(201).json({ data: response });
    }

    // @desc List all Users
    // @route GET api/v1/Users
    // @access private
    async getUsers(req: Request, res: Response) {

       const rawFilter = qs.parse(req.url.split('?')[1] || '', { ignoreQueryPrefix: true });
        const userList = await this.userModel.getUser(rawFilter);
        console.log('userList',userList);
        res.status(201).json({ results: userList.length, page: rawFilter.page, data: userList });
    }

    // @desc get certain user
    // @route GET api/v1/Users/:id
    // @access private
    async getUserById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const user = await this.userModel.getUserById(id);
        if(!user){
            return next(new ApiError(404, `user not found`));
        } 
        res.status(201).json({ data: user });
    }

    // @desc Update user
    // @route PUT api/v1/Users/:id
    // @access Private
    async updateUser(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        if(req.body.name){
            req.body.slug = slugify(req.body.name);
        }
        const user = await this.userModel.updateUser(id, req.body);
        if(!user){
            return next(new ApiError(404, `user not found`));
        }
        if ('error' in user) {
        return next(new ApiError(400, `email is already in exist`)); 
    }
        res.status(201).json({ data: user });
    }

    async changePassword(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const response = await this.userModel.changePassword(id, req.body.password, req.body.currentPassword);
        if(response === "user not found") {
            return next(new ApiError(404, `user not found`));
        } else if (response === "current password is incorrect") {
            return next(new ApiError(400, `current password is incorrect`));
        }else{
             res.status(201).json({ data: response });
        }
    }

    // @desc Delete user
    // @route DELETE api/v1/Users/:id
    // @access Private
    async deleteUser(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const user = await this.userModel.deleteUser(id);
        if(!user){
            return next(new ApiError(404, `user not found`));
        } 
        res.status(201).json({ data: user });
    }

    getMe(req: Request, res: Response, next: NextFunction) {
        req.params.id = req.user.id;
        next();
    }
    
}

export { UserController }

