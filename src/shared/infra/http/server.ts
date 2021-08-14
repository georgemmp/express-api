import 'reflect-metadata';
import 'dotenv/config';

import express, { json, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import 'express-async-errors';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from './routes';

import '@shared/infra/database';
import '@shared/container';

const app = express();

app.use(cors());
app.use(json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);

app.use(errors);

app.use(
  (error: Error, request: Request, response: Response, _: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    console.error(error.message);

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  },
);

app.listen(3333, () => console.log('Run on port 3333'));

export default app;
