import assert from 'assert';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import * as helper from './helper';
import * as adapter from './adapter';

describe('/auth', () => {
  describe('/register', () => {
    test('should register a user and send confirmation email', async () => {
      const userParams = {
        emailAddress: `d.mendeleev-${uuid()}@spbu.ru`,
        username: `chemboi-${uuid()}`,
        password: 'elementary',
      };
      const res = await axios.post('http://localhost/auth/register', userParams);
      assert.strictEqual(res.status, 200);

      const internalUser = await adapter.getUser(userParams.emailAddress);
      const { id, ...expectedUser } = internalUser;
      assert.deepStrictEqual(expectedUser, {
        emailAddress: userParams.emailAddress,
        username: userParams.username,
        status: 'pendingActivation',
      });

      const emails = await helper.getEmailsByToAddress(userParams.emailAddress);
      const email = emails[0];
      assert.ok(email);
      assert.strictEqual(email.Content?.Simple?.Subject?.Data, 'Ludi - Confirm Registration');
    });
  });

  describe('/confirm-registration', () => {
    test('should confirm registration for, and activate a user', async () => {
      const userParams = {
        emailAddress: `d.mendeleev-${uuid()}@spbu.ru`,
        username: `chemboi-${uuid()}`,
        password: 'elementary',
      };
      await axios.post('http://localhost/auth/register', userParams);

      await helper.confirmRegistration(userParams.emailAddress);

      const internalUser = await adapter.getUser(userParams.emailAddress);
      const { id, ...expectedUser } = internalUser;
      assert.deepStrictEqual(expectedUser, {
        emailAddress: userParams.emailAddress,
        username: userParams.username,
        status: 'active',
      });
    });
  });

  describe('/login', () => {
    test('should log a user in', async () => {
      const userParams = {
        emailAddress: `d.mendeleev-${uuid()}@spbu.ru`,
        username: `chemboi-${uuid()}`,
        password: 'elementary',
      };
      await axios.post('http://localhost/auth/register', userParams);

      await helper.confirmRegistration(userParams.emailAddress);

      const reqParams = {
        emailAddress: userParams.emailAddress,
        password: userParams.password,
      };
      const res = await axios.post('http://localhost/auth/login', reqParams);
      assert.deepStrictEqual(res.data, {
        emailAddress: userParams.emailAddress,
        username: userParams.username,
      });
    });
  });
});
