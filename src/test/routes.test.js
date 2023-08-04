import mongoose from 'mongoose'
import { api } from './helpers/user.js'
import { server } from '../index.js'

describe('Routes', () => {
  test('Error ruta no encontrada', async () => {
    await api.get('/')
      .expect(404)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
