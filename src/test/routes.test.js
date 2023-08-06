import mongoose from 'mongoose'
import { api } from './helpers/user.js'
import server from '../index.js'

afterAll(async () => {
  await mongoose.connection.close()
  await server.close()
})

describe('Routes', () => {
  test('Error ruta no encontrada', async () => {
    await api.get('/')
      .expect(404)
  })
})
