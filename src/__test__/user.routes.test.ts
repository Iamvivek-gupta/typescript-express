import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from '../app';
import User from '../models/user.model';
dotenv.config();


const uri:any = process.env.MONGODB_URI;

console.log(uri, typeof uri)


beforeAll(async () => {
  await mongoose.connect(uri, {
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User API', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('name', 'John Doe');
    expect(res.body).toHaveProperty('email', 'john@example.com');
  });

  it('should fetch all users', async () => {
    await User.create({ name: 'John Doe', email: 'john@example.com' });
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toHaveProperty('name', 'John Doe');
    expect(res.body[0]).toHaveProperty('email', 'john@example.com');
  });
});