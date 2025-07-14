import { ApiError } from "../utils/apiError"
import { Request, Response, NextFunction } from "express";
function globalErrorHndler(err: ApiError, req: Request, res: Response, next: NextFunction) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development') {
        sendErrorForDev(err, res)
    } else if(process.env.NODE_ENV === 'production') {
        sendErrorForProd(err, res)
    }
}

function sendErrorForDev(err: ApiError, res: Response) {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

function sendErrorForProd(err: ApiError, res: Response) {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    })
}

export { globalErrorHndler }