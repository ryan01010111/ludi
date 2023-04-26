import express from 'express';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);

app.listen(3000, () => console.log('Server up...'));
