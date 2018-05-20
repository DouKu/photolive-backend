'use strict';
import { request } from '../bootstrap.test';
import assert from 'power-assert';

describe('Controller: user', () => {
  let user = null;
  it.skip('login', async () => {
    user = await request
      .post('/api/v1/login')
      .send({
        username: '123456789',
        password: '123456789'
      })
      .expect(200);

    console.log(user.body);
    assert(user !== null);
  });
  it('register', async () => {
    const result = await request
      .post('/api/v1/register')
      .send({
        phone: '123456789',
        username: '123456789',
        password: '123456789',
        nickname: 'lalalala'
      });

    console.log(result.body);
    assert(result.body.code === 200);
  });
});
