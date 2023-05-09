import express from 'express';
import cookieParser from 'cookie-parser';
import { runMigration } from './db';

// routes
import authRouter from './routes/auth';

async function init() {
  await runMigration();

  const app = express();

  // middleware
  app.use(express.json());
  app.use(cookieParser());

  // routes
  app.use('/auth', authRouter);

  app.listen(80, () => console.log('Server up...'));
}

init();
