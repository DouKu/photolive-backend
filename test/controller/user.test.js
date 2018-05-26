'use strict';
import { request } from '../bootstrap.test';
import assert from 'power-assert';
import Users from '../../api/models/Users';

describe('Controller: user', () => {
  let user = null;
  it('login', async () => {
    user = await request
      .post('/api/v1/login')
      .send({
        username: '123456789',
        password: '123456789'
      })
      .expect(200);

    console.log(user.body);
  });
  it('register', async () => {
    await request
      .post('/api/v1/register')
      .send({
        username: '222222222',
        password: '123456789',
        nickname: 'qqqqq'
      })
      .expect(200);

    const newUser = await Users.findOne({ raw: true, where: { username: '222222222' } });
    assert(newUser !== null);
  });
});
