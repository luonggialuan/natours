const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldDB = (err) => {
    const value = Object.values(err.keyValue)[0];
    const message = `Duplicate file value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please login again!', 401);

const handleJWTExpiredError = () =>
    new AppError('Your token has expired! Please log in again', 401);

const sendErrorDev = (err, req, res) => {
    // A) API
    if (req.originalUrl.match(/^[/]api[/]v/)) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }
    // B) RENDERED WEBSITE
    console.error('ERROR', err);
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message,
    });
};

const sendErrorProd = (err, req, res) => {
    // A) API
    if (req.originalUrl.match(/^[/]api[/]v/)) {
        // A) Operational, trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.statusCode,
                message: err.message,
            });
        }
        // B) Programming or other unknow error: don't leak error details
        // 1) Log error
        console.error('ERROR', err);

        // 2) Send generit message
        return res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!',
        });
    }

    // B) RENDERED WEBSITE
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message,
        });
    }
    // B) Programming or other unknow error: don't leak error details
    // 1) Log error
    console.error('ERROR', err);

    // 2) Send generic message
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later.',
    });
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        // let error = { ...err };

        let error = Object.create(err);

        if (err.name === 'CastError') error = handleCastErrorDB(err);

        if (err.code === 11000) error = handleDuplicateFieldDB(err);

        if (err.name === 'ValidationError') error = handleValidationErrorDB(err);

        if (err.name === 'JsonWebTokenError') error = handleJWTError(err);

        if (err.name === 'TokenExpiredError') error = handleJWTExpiredError(err);

        sendErrorProd(error, req, res);
    }
};
