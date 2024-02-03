import mongoose from 'mongoose'
import server from '../../index.js'
import { api } from './helpers/user.js'

beforeEach(async () => {
  await mongoose.connection.close()
})

afterAll(async () => {
  await mongoose.connection.close()
  await server.close()
})

describe('DB', () => {
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
