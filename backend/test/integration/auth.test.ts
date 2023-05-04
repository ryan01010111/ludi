import assert from 'assert';
import axios from 'axios';

describe('/auth', () => {
  describe('/register', () => {
    test('should register a user', async () => {
      const userParams = {
        emailAddress: 'd.mendeleev@spbu.ru',
        username: 'chemboi',
        password: 'elementary',
      };
      const res = await axios.post('http://localhost:3000/auth/register', userParams);
      assert.strictEqual(res.status, 200);
      // TODO: check conf. email
    });
  });
});
