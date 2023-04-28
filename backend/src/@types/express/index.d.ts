import { TokenUser } from '..';

declare global {
  namespace Express {
    interface Request {
      // TODO
      user: TokenUser
    }
  }
}
