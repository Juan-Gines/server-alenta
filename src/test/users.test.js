import supertest from 'supertest'
import { expressApp, server } from '../index.js'
import mongoose from 'mongoose'
import UserModel from '#Models/user.js'
import { errorMessageES } from '#Lang/es/errorMessage.js'
import { badUser, errToken, getContent, getToken, initialUsers, passwordChange, userToInsert } from './helpers.js'

const error = errorMessageES.user

export const api = supertest(expressApp)

beforeEach(async () => {
  await UserModel.deleteMany({})

  initialUsers.forEach(async (user) => {
    const newUser = new UserModel(user)
    await newUser.save()
  })
})

describe.skip('auth', () => {
  test('POST api/auth/register guarda un usuario', async () => {
    const token = await getToken()
    const initialContent = await getContent(token)
    const res = await api
      .post('/api/auth/register')
      .send(userToInsert)
      .expect(201)
      .expect('Content-Type', /json/)
    const content = await getContent(token)
    const data = res.body.data
    expect(data).toHaveProperty('name')
    expect(data).toHaveProperty('email')
    expect(data).toHaveProperty('role')
    expect(data).toHaveProperty('updatedAt')
    expect(data).toHaveProperty('createdAt')
    expect(data).toHaveProperty('id')
    expect(content.length).toBe(initialContent.length + 1)
  })

  test('POST api/auth/register error name min, email format ,password erroneo min', async () => {
    const { minLength, badEmail, badPassMinLength } = badUser
    const user = { name: minLength, email: badEmail, password: badPassMinLength }
    const res = await api
      .post('/api/auth/register')
      .send(user)
      .expect(400)
      .expect('Content-Type', /json/)
    const content = res.body.data.error.map(d => d.message)
    expect(content).toContain(error.errMinLength(4))
    expect(content).toContain(error.errMinLength(8))
    expect(content).toContain(error.errFormatEmail)
    expect(content).toContain(error.errFormatPassword)
  })

  test('POST api/auth/register name max password max y sin email', async () => {
    const { maxLength } = badUser
    const user = { name: maxLength, password: maxLength }
    const res = await api
      .post('/api/auth/register')
      .send(user)
      .expect(400)
      .expect('Content-Type', /json/)
    const content = res.body.data.error.map(d => d.message)
    expect(content).toContain(error.errMaxLength(25))
    expect(content).toContain(error.errMaxLength(20))
    expect(content).toContain(error.errRequired('email'))
  })

  test('POST api/auth/register body con parámetros de más', async () => {
    const user = { ...userToInsert, hola: 'error' }
    const res = await api
      .post('/api/auth/register')
      .send(user)
      .expect(400)
      .expect('Content-Type', /json/)
    const content = res.body.data.error.map(d => d.message)
    expect(content).toContain(error.errFormatObject)
  })

  test('POST api/auth/register body parámetros requeridos', async () => {
    const user = { }
    const res = await api
      .post('/api/auth/register')
      .send(user)
      .expect(400)
      .expect('Content-Type', /json/)
    const content = res.body.data.error.map(d => d.message)
    expect(content).toContain(error.errRequired('nombre'))
    expect(content).toContain(error.errRequired('password'))
    expect(content).toContain(error.errRequired('email'))
  })

  test('POST api/auth/register error tipo en name, password y email', async () => {
    const { type } = badUser
    const user = { name: type, password: type, email: type }
    const res = await api
      .post('/api/auth/register')
      .send(user)
      .expect(400)
      .expect('Content-Type', /json/)
    const content = res.body.data.error.map(d => d.message)
    expect(content).toContain(error.errTypeString)
  })

  test('POST api/auth/register error el email es único', async () => {
    const user = { ...initialUsers[0], password: 'Test1234' }
    const res = await api
      .post('/api/auth/register')
      .send(user)
      .expect(409)
      .expect('Content-Type', /json/)
    const content = res.body.data.error
    expect(content).toContain(error.errEmailDuplicated)
  })

  test('POST api/auth/login logea un usuario y devuelve token', async () => {
    const user = { email: 'raquel@test.com', password: 'Test1234' }
    const res = await api.post('/api/auth/login')
      .send(user)
      .expect(200)
      .expect('Content-Type', /json/)
    const data = res.body.data
    expect(data).toHaveProperty('token')
  })

  test('POST api/auth/login email y password error de tipo', async () => {
    const { type } = badUser
    const user = { email: type, password: type }
    const res = await api.post('/api/auth/login')
      .send(user)
      .expect(400)
      .expect('Content-Type', /json/)
    const content = res.body.data.error.map(d => d.message)
    expect(content).toContain(error.errTypeString)
  })

  test('POST api/auth/login password maxLenght no email', async () => {
    const { maxLength } = badUser
    const user = { password: maxLength }
    const res = await api.post('/api/auth/login')
      .send(user)
      .expect(400)
      .expect('Content-Type', /json/)
    const content = res.body.data.error.map(d => d.message)
    expect(content).toContain(error.errRequired('email'))
    expect(content).toContain(error.errMaxLength(20))
  })

  test('POST api/auth/login email y password formato erroneo, pass min', async () => {
    const { badEmail, badPassMinLength } = badUser
    const user = { email: badEmail, password: badPassMinLength }
    const res = await api.post('/api/auth/login')
      .send(user)
      .expect(400)
      .expect('Content-Type', /json/)
    const content = res.body.data.error.map(d => d.message)
    expect(content).toContain(error.errFormatEmail)
    expect(content).toContain(error.errMinLength(8))
    expect(content).toContain(error.errFormatPassword)
  })

  test('POST api/auth/login parámetros requeridos', async () => {
    const user = { }
    const res = await api.post('/api/auth/login')
      .send(user)
      .expect(400)
      .expect('Content-Type', /json/)
    const content = res.body.data.error.map(d => d.message)
    expect(content).toContain(error.errRequired('email'))
    expect(content).toContain(error.errRequired('password'))
  })

  test('POST api/auth/login body con parámetros de más', async () => {
    const user = userToInsert
    const res = await api
      .post('/api/auth/login')
      .send(user)
      .expect(400)
      .expect('Content-Type', /json/)
    const content = res.body.data.error.map(d => d.message)
    expect(content).toContain(error.errFormatObject)
  })

  test('PATCH api/auth/password evalua el viejo password y lo cambia', async () => {
    const token = await getToken()
    const res = await api
      .patch('/api/auth/password')
      .auth(token, { type: 'bearer' })
      .send(passwordChange)
      .expect(200)
      .expect('Content-Type', /json/)
    expect(res.body.data.message).toEqual('El password de Raquel se cambió correctamente.')
  }, 0)

  test('PATCH api/auth/password error password max, min y format', async () => {
    const { badPassMinLength, maxLength } = badUser
    const newPass = { oldPassword: badPassMinLength, newPassword: maxLength }
    const token = await getToken()
    const res = await api
      .patch('/api/auth/password')
      .auth(token, { type: 'bearer' })
      .send(newPass)
      .expect(400)
      .expect('Content-Type', /json/)
    const content = res.body.data.error.map(d => d.message)
    expect(content).toContain(error.errMaxLength(20))
    expect(content).toContain(error.errMinLength(8))
    expect(content).toContain(error.errFormatPassword)
  })

  test('PATCH api/auth/password error password de tipo y requerido', async () => {
    const newPass = { oldPassword: 123 }
    const token = await getToken()
    const res = await api
      .patch('/api/auth/password')
      .auth(token, { type: 'bearer' })
      .send(newPass)
      .expect(400)
      .expect('Content-Type', /json/)
    const content = res.body.data.error.map(d => d.message)
    expect(content).toContain(error.errTypeString)
    expect(content).toContain(error.errRequired('nuevo password'))
  })

  test('PATCH api/auth/password error parámetros de más', async () => {
    const newPass = { ...passwordChange, hola: 'TREe4533' }
    const token = await getToken()
    const res = await api
      .patch('/api/auth/password')
      .auth(token, { type: 'bearer' })
      .send(newPass)
      .expect(400)
      .expect('Content-Type', /json/)
    const content = res.body.data.error.map(d => d.message)
    expect(content).toContain(error.errFormatObject)
  })
})

describe('user', () => {
  test('GET /api/users recupera los registros de user', async () => {
    const token = await getToken()
    const res = await api.get('/api/users')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .expect('Content-Type', /json/)
    const content = res.body.data
    expect(content.length).toBe(2)
    content.forEach(user => {
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('name')
      expect(user).toHaveProperty('email')
      expect(user).toHaveProperty('role')
      expect(user).toHaveProperty('createdAt')
      expect(user).toHaveProperty('updatedAt')
    })
  })

  test('GET /api/users token erroneo', async () => {
    const token = errToken
    const res = await api.get('/api/users')
      .auth(token, { type: 'bearer' })
      .expect(401)
      .expect('Content-Type', /json/)
    const content = res.body.data.error
    expect(content).toContain(error.errUnAuthorized)
  }, 20000)
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
