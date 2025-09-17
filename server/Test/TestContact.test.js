/**
 * @file Tests/TestContact. test.js
 */

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = require('../server/app');
const UserModel = require('../server/Model/UserModel');
const ContactModel = require('../server/Model/ContactModel');

const JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

let mongoServer;
let user;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // créer un utilisateur de test
  const hashed = await bcrypt.hash('pass1234', 10);
  user = await UserModel.create({
    Email: 'user@test.com',
    Password: hashed,
    First_Name: 'John',
    Last_Name: 'Doe'
  });

  token = jwt.sign({ userId: user._id.toString(), Email: user.Email }, JWT_SECRET);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await ContactModel.deleteMany();
});

describe('Contacts Routes', () => {
  test('POST /contact/:id/create crée un contact', async () => {
    const res = await request(app)
      .post(`/contact/${user._id}/create`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        First_Name: 'Alice',
        Last_Name: 'Martin',
        Phone_Number: '0606060606'
      })
      .expect(201);

    expect(res.body.First_Name).toBe('Alice');
    expect(res.body.Last_Name).toBe('Martin');
    expect(res.body.Phone_Number).toBe('0606060606');
  });

  test('GET /contact/:id renvoie la liste des contacts', async () => {
    const contact = await ContactModel.create({
      First_Name: 'Bob',
      Last_Name: 'Lefevre',
      Phone_Number: '0707070707',
      users: user._id
    });
    await UserModel.findByIdAndUpdate(user._id, { $push: { contacts: contact._id } });

    const res = await request(app)
      .get(`/contact/${user._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].First_Name).toBe('Bob');
  });

  test('PATCH /contact/:userId/update/:contactId met à jour un contact', async () => {
    const contact = await ContactModel.create({
      First_Name: 'Charlie',
      Last_Name: 'Dupont',
      Phone_Number: '0808080808',
      users: user._id
    });
    await UserModel.findByIdAndUpdate(user._id, { $push: { contacts: contact._id } });

    const res = await request(app)
      .patch(`/contact/${user._id}/update/${contact._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ Phone_Number: '0999999999' })
      .expect(200);

    expect(res.body.Phone_Number).toBe('0999999999');
  });

  test('DELETE /contact/:userId/delete/:contactId supprime le contact', async () => {
    const contact = await ContactModel.create({
      First_Name: 'David',
      Last_Name: 'Smith',
      Phone_Number: '0611111111',
      users: user._id
    });
    await UserModel.findByIdAndUpdate(user._id, { $push: { contacts: contact._id } });

    const res = await request(app)
      .delete(`/contact/${user._id}/delete/${contact._id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.message).toBe('Contact supprimé avec succès');

    const stillExists = await ContactModel.findById(contact._id);
    expect(stillExists).toBeNull();
  });
});
