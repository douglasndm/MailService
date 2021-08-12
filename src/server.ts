import { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import AppError from '@errors/AppError';

import App from './app';

App.use((err: Error, request: Request, response: Response, _: NextFunction) => {
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            status: 'error',
            errorCode: err.errorCode,
            message: err.message,
        });
    }

    console.error(err);

    return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
    });
});

App.listen(Number(process.env.PORT), process.env.HOST || 'localhost', () => {
    console.log(`Server is running at ${process.env.HOST}:${process.env.PORT}`);
});
