import express from 'express';
import cookieParser from 'cookie-parser';

// routes
import authRouter from './routes/api/auth';

const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/api/auth', authRouter);

app.listen(3000, () => console.log('Server up...'));
