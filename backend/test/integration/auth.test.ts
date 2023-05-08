import assert from 'assert';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import * as helper from './helper';

describe('/auth', () => {
  describe('/register', () => {
    test('should register a user', async () => {
      const userParams = {
        emailAddress: `d.mendeleev-${uuid()}@spbu.ru`,
        username: `chemboi-${uuid()}`,
        password: 'elementary',
      };
      const res = await axios.post('http://localhost:3000/auth/register', userParams);
      assert.strictEqual(res.status, 200);

      const email = await helper.getRegistrationConfirmationEmail(userParams.emailAddress);
      assert.ok(email);
      // TODO
    });
  });
});
