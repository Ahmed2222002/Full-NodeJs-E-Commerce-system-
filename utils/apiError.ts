
class ApiError extends Error{
    statusCode: number;
    message: string;
    status: string;
    isOperational: boolean;
    constructor(status: number, message: string){
        super(message);
        this.statusCode = status;
        this.message = message;
        this.status = Math.floor(this.statusCode/ 100) === 4 ? 'fail' : 'error';
        this.isOperational = true;
    }
}

export {ApiError};