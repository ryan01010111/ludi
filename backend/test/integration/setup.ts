import { deleteAllEmails } from './helper';
import { disconnect } from './adapter';

beforeEach(async () => {
  await deleteAllEmails();
});

afterAll(async () => {
  await disconnect();
});
