import { Request, Response, NextFunction } from "express";

// @desc this middleware will set the category id from req.params in case create new subCategory in cetain category
function setCategoryIdToBody(req: Request, res: Response, next: NextFunction) {
    if (!req.body.category) req.body.category = req.params.categoryId;
    next();
}

export { setCategoryIdToBody };