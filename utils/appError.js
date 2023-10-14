class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
        // console.log('in AppError ++++++');
        // console.log('this.statusCode ', this.statusCode);
        // console.log('this.status ', this.status);
        // console.log('this.isOperational ', this.isOperational);
        // console.log('end AppError +++++');
    }
}

module.exports = AppError;
