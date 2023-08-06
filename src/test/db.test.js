import mongoose from 'mongoose'
import server from '../index.js'
import connectDB from '#Config/db.js'
import { api, userToInsert } from './helpers/user.js'

beforeAll(async () => {
  await mongoose.connection.close()

  const connectionString = process.env.MONGODB_URL_FAILED
  await connectDB(connectionString)
})

afterAll(async () => {
  await mongoose.connection.close()
  await server.close()
})

describe('DB', () => {
  test('POST api/auth/register DB error al guardar un usuario', async () => {
    const res = await api
      .post('/api/auth/register')
      .send(userToInsert)
      .expect(500)
      .expect('Content-Type', /json/)
    const content = res.body.data.error
    expect(content).toContain('Client must be connected before running operations')
  })

  test('POST api/auth/login DB error al logear', async () => {
    const user = { email: 'raquel@test.com', password: 'Test1234' }
    const res = await api
      .post('/api/auth/login')
      .send(user)
      .expect(500)
      .expect('Content-Type', /json/)
    const content = res.body.data.error
    expect(content).toContain('Client must be connected before running operations')
  })
})
