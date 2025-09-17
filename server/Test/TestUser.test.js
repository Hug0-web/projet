/**
 * @file Test/TestUser.test.js
 */
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');

const app = require('../server/app'); // Fichier où tu crées l'app Express
const UserModel = require('../server/Model/UserModel');

let mongoServer;
const JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

describe('Users Routes', () => {
  let userId;
  let token;

  beforeAll(async () => {
    // Démarre Mongo en mémoire
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await UserModel.deleteMany();
  });

  test('POST /users/register crée un nouvel utilisateur', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({ Email: 'test@example.com', Password: 'pass1234' })
      .expect(201);

    expect(res.body.Email).toBe('test@example.com');
    userId = res.body._id;
  });

  test('POST /users/login renvoie un token JWT', async () => {
    // créer un user avant
    await UserModel.create({
      Email: 'login@example.com',
      Password: await require('bcrypt').hash('mypassword', 10)
    });

    const res = await request(app)
      .post('/users/login')
      .send({ Email: 'login@example.com', Password: 'mypassword' })
      .expect(200);

    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  test('GET /users/:id retourne l’utilisateur (auth requis)', async () => {
    const user = await UserModel.create({
      Email: 'get@example.com',
      Password: 'hash'
    });

    const res = await request(app)
      .get(`/users/${user._id}`)
      .set('Authorization', `Bearer ${jwt.sign({ userId: user._id, Email: user.Email }, JWT_SECRET)}`)
      .expect(201);

    expect(res.body.Email).toBe('get@example.com');
  });

  test('PATCH /users/:id met à jour l’utilisateur', async () => {
    const user = await UserModel.create({
      Email: 'update@example.com',
      Password: 'hash'
    });

    const res = await request(app)
      .patch(`/users/${user._id}`)
      .set('Authorization', `Bearer ${jwt.sign({ userId: user._id, Email: user.Email }, JWT_SECRET)}`)
      .send({ First_Name: 'Alice' })
      .expect(201);

    expect(res.body.First_Name).toBe('Alice');
  });

  test('DELETE /users/:id supprime l’utilisateur', async () => {
    const user = await UserModel.create({
      Email: 'delete@example.com',
      Password: 'hash'
    });

    await request(app)
      .delete(`/users/${user._id}`)
      .set('Authorization', `Bearer ${jwt.sign({ userId: user._id, Email: user.Email }, JWT_SECRET)}`)
      .expect(200 || 204);
  });

  test('POST /logout supprime le cookie', async () => {
    const user = await UserModel.create({
      Email: 'logout@example.com',
      Password: 'hash'
    });
    const tok = jwt.sign({ userId: user._id, Email: user.Email }, JWT_SECRET);

    const res = await request(app)
      .post('/logout')
      .set('Authorization', `Bearer ${tok}`)
      .expect(200);

    expect(res.body.message).toBe('Déconnecté avec succès');
  });
});