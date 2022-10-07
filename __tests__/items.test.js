const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockUser = {
  email: 'test@example.com',
  password: '123456',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;

  // Create an "agent" that gives us the ability
  // to store cookies between requests in a test
  const agent = request.agent(app);

  // Create a user to sign in with
  const user = await UserService.create({ ...mockUser, ...userProps });

  // ...then sign in
  const { email } = user;
  await agent.post('/api/v1/auth/signin').send({ email, password });
  return [agent, user];
};

describe('items', () => {
  beforeEach(() => {
    return setup(pool);
  });
  afterAll(() => {
    pool.end();
  });

  it('#POST /api/v1/items creates a new item', async () => {
    const [agent, user] = await registerAndLogin();
    const item = { description: 'pizza' };
    const res = await agent.post('/api/v1/items').send(item);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: expect.any(String),
      description: item.description,
      user_id: user.id,
      bought: false,
    });
  });

  it('#GET/api/v1/items lists all items for authenticated user', async () => {
    const [agent, user] = await registerAndLogin();
    const item = { description: 'wine' };
    const res = await agent.post('/api/v1/items').send(item);
    expect(res.status).toBe(200);

    const resp = await agent.get('/api/v1/items');
    expect(resp.body.length).toBe(1);
    expect(resp.body[0]).toEqual({
      id: expect.any(String),
      description: 'wine',
      user_id: user.id,
      bought: false,
    });
  });
});
