'use strict';
import { request } from '../bootstrap.test';
import assert from 'power-assert';
import { Models } from '../../config/sequelize';

describe('Controller: user', () => {
  let token = null;
  before('login', async () => {
    let user = await request
      .post('/api/v1/login')
      .send({
        username: '123456789',
        password: '123456789'
      })
      .expect(200);

    token = user.body.token;
    assert(token !== null);
  });
  it('addActivity', async () => {
    let result = await request
      .post('/api/auth/activity')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        name: '同学聚会'
      })
      .expect(200);
    assert(result.body.code === 200);
  });
  it('editActivity', async () => {
    let act = await Models.Activities.findOne({ where: { name: '同学聚会' } });
    let result = await request
      .put(`/api/auth/activity/${act.id}`)
      .set({ Authorization: `Bearer ${token}` })
      .send({
        avatar: 'tongxuejuhui'
      })
      .expect(200);

    assert(result.body.code === 200);
  });
  it('listActivity', async () => {
    let result = await request
      .get(`/api/auth/activity`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(200);

    assert(result.body.data.length >= 3);
  });
});
