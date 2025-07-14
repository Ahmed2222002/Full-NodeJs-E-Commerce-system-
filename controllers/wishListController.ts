import { Request, Response } from "express";
import { userModel } from "../config/AppContext";

class WishListController {

   async addToWishList(req: Request, res: Response) {
        const wishList = await userModel.getUserModel().findByIdAndUpdate(req.user._id, { $addToSet: { wishList: req.body.productId } }, { new: true })

        res.status(200).json({ data: wishList });
    }

    async getWishList(req: Request, res: Response) {

        const wishList = await userModel.getUserModel().findById(req.user._id).populate("wishList");

        res.status(200).json({ data: wishList });
    }

    async removeFromWishList(req: Request, res: Response) {
        const wishList = await userModel.getUserModel().findByIdAndUpdate(req.user._id, { $pull: { wishList: req.body.productId } }, { new: true })

        res.status(200).json({ data: wishList });
    }
}

export { WishListController };