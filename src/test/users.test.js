import supertest from 'supertest'
import { expressApp, server } from '../index.js'
import mongoose from 'mongoose'
import UserModel from '#Models/user.js'
import { errorMessageES } from '#Lang/es/errorMessage.js'
import { badUser, errTokenExpired, errTokenNoUser, getContent, getToken, initialUsers, passwordChange, userToInsert } from './helpers/user.js'

const error = errorMessageES

export const api = supertest(expressApp)

beforeEach(async () => {
  await UserModel.deleteMany({})
  const newUser1 = new UserModel(initialUsers[0])
  await newUser1.save()
  const newUser2 = new UserModel(initialUsers[1])
  await newUser2.save()
})

describe('auth', () => {
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

  test('POST api/auth/register guarda un usuario con body sin trim', async () => {
    const { trimEmailValue, trimNameValue, trimPassValue } = badUser
    const user = { '   email   ': trimEmailValue, '   name   ': trimNameValue, '   password   ': trimPassValue }
    const token = await getToken()
    const initialContent = await getContent(token)
    const res = await api
      .post('/api/auth/register')
      .send(user)
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

  test('PATCH api/auth/password error newPassword y oldPassword requerido', async () => {
    const newPass = { }
    const token = await getToken()
    const res = await api
      .patch('/api/auth/password')
      .auth(token, { type: 'bearer' })
      .send(newPass)
      .expect(400)
      .expect('Content-Type', /json/)
    const content = res.body.data.error.map(d => d.message)
    expect(content).toContain(error.errRequired('antiguo password'))
    expect(content).toContain(error.errRequired('nuevo password'))
  })

  test('PATCH api/auth/password error newPassword y oldPassword iguales', async () => {
    const newPass = { oldPassword: 'Test1234', newPassword: 'Test1234' }
    const token = await getToken()
    const res = await api
      .patch('/api/auth/password')
      .auth(token, { type: 'bearer' })
      .send(newPass)
      .expect(400)
      .expect('Content-Type', /json/)
    const content = res.body.data.error
    expect(content).toContain(error.errNewPassEqualToOld)
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

  test('GET /api/users token invalido', async () => {
    const token = await getToken()
    const errToken = token.slice(0, -2)
    const res = await api.get('/api/users')
      .auth(errToken, { type: 'bearer' })
      .expect(401)
      .expect('Content-Type', /json/)
    const content = res.body.data.error.message
    expect(content).toContain('invalid signature')
  })

  test('GET /api/users sin token', async () => {
    const res = await api.get('/api/users')
      .expect(401)
      .expect('Content-Type', /json/)
    const content = res.body.data.error
    expect(content).toContain(error.errUnAuthorized)
  })

  test('GET /api/users token Expirado', async () => {
    const token = errTokenExpired
    const res = await api.get('/api/users')
      .auth(token, { type: 'bearer' })
      .expect(401)
      .expect('Content-Type', /json/)
    const content = res.body.data.error.message
    expect(content).toContain('jwt expired')
  })

  test('GET /api/users token con usuario inexistente', async () => {
    const token = errTokenNoUser
    const res = await api.get('/api/users')
      .auth(token, { type: 'bearer' })
      .expect(401)
      .expect('Content-Type', /json/)
    const content = res.body.data.error
    expect(content).toContain(error.errUnAuthorized)
  })

  test('GET /api/users/profile recupera los registgros de un usuario', async () => {
    const token = await getToken()
    const res = await api.get('/api/users/profile')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .expect('Content-Type', /json/)
    const content = res.body.data
    expect(content).toHaveProperty('id')
    expect(content).toHaveProperty('name')
    expect(content).toHaveProperty('email')
    expect(content).toHaveProperty('role')
    expect(content).toHaveProperty('createdAt')
    expect(content).toHaveProperty('updatedAt')
  })

  test('PATCH /api/users/personaldata updatea el nombre y los apellidos', async () => {
    const token = await getToken()
    const res = await api.patch('/api/users/personaldata')
      .auth(token, { type: 'bearer' })
      .send({ name: 'Fulano', surname: 'De Tal' })
      .expect(200)
      .expect('Content-Type', /json/)
    const content = res.body.data
    expect(content).toHaveProperty('name')
    expect(content).toHaveProperty('surname')
    expect(content.name).toEqual('Fulano')
    expect(content.surname).toEqual('De Tal')
  })

  test('PATCH /api/users/personaldata error requeridos', async () => {
    const token = await getToken()
    const res = await api.patch('/api/users/personaldata')
      .auth(token, { type: 'bearer' })
      .send({ })
      .expect(400)
      .expect('Content-Type', /json/)
    const content = res.body.data.error.map(d => d.message)
    expect(content).toContain(error.errRequired('nombre'))
    expect(content).toContain(error.errRequired('apellidos'))
  })

  test('PATCH /api/users/personaldata error apellidos min', async () => {
    const token = await getToken()
    const res = await api.patch('/api/users/personaldata')
      .auth(token, { type: 'bearer' })
      .send({ surname: badUser.minLength })
      .expect(400)
      .expect('Content-Type', /json/)
    const content = res.body.data.error.map(d => d.message)
    expect(content).toContain(error.errMinLength(4))
  })

  test('PATCH /api/users/personaldata error apellidos max', async () => {
    const token = await getToken()
    const res = await api.patch('/api/users/personaldata')
      .auth(token, { type: 'bearer' })
      .send({ surname: badUser.maxLength })
      .expect(400)
      .expect('Content-Type', /json/)
    const content = res.body.data.error.map(d => d.message)
    expect(content).toContain(error.errMaxLength(50))
  })

  test('PATCH /api/users/personaldata error apellidos de tipo', async () => {
    const token = await getToken()
    const res = await api.patch('/api/users/personaldata')
      .auth(token, { type: 'bearer' })
      .send({ surname: badUser.type })
      .expect(400)
      .expect('Content-Type', /json/)
    const content = res.body.data.error.map(d => d.message)
    expect(content).toContain(error.errTypeString)
  })

  test('PATCH /api/users/personaldata body con parámetros de más', async () => {
    const token = await getToken()
    const res = await api.patch('/api/users/personaldata')
      .auth(token, { type: 'bearer' })
      .send({ name: 'Fulano', surname: 'De Tal', hola: 'fjksdf' })
      .expect(400)
      .expect('Content-Type', /json/)
    const content = res.body.data.error.map(d => d.message)
    expect(content).toContain(error.errFormatObject)
  })
  test('PATCH /api/users/image updatea la imagen', async () => {
    const token = await getToken()
    const res = await api.patch('/api/users/image')
      .auth(token, { type: 'bearer' })
      .send({ image: 'imagen.jpg' })
      .expect(200)
      .expect('Content-Type', /json/)
    const content = res.body.data
    expect(content).toHaveProperty('image')
    expect(content.image).toEqual('imagen.jpg')
  })

  test('PATCH /api/users/image error requeridos', async () => {
    const token = await getToken()
    const res = await api.patch('/api/users/image')
      .auth(token, { type: 'bearer' })
      .send({ })
      .expect(400)
      .expect('Content-Type', /json/)
    const content = res.body.data.error.map(d => d.message)
    expect(content).toContain(error.errRequired('imagen'))
  })

  test('PATCH /api/users/image error imagen min', async () => {
    const token = await getToken()
    const res = await api.patch('/api/users/image')
      .auth(token, { type: 'bearer' })
      .send({ image: badUser.minLength })
      .expect(400)
      .expect('Content-Type', /json/)
    const content = res.body.data.error.map(d => d.message)
    expect(content).toContain(error.errMinLength(4))
  })

  test('PATCH /api/users/image error apellidos de tipo', async () => {
    const token = await getToken()
    const res = await api.patch('/api/users/image')
      .auth(token, { type: 'bearer' })
      .send({ image: badUser.type })
      .expect(400)
      .expect('Content-Type', /json/)
    const content = res.body.data.error.map(d => d.message)
    expect(content).toContain(error.errTypeString)
  })

  test('PATCH /api/users/image body con parámetros de más', async () => {
    const token = await getToken()
    const res = await api.patch('/api/users/image')
      .auth(token, { type: 'bearer' })
      .send({ image: 'imagen.jpg', surname: 'De Tal', hola: 'fjksdf' })
      .expect(400)
      .expect('Content-Type', /json/)
    const content = res.body.data.error.map(d => d.message)
    expect(content).toContain(error.errFormatObject)
  })

  test('DELETE /api/users Borra un usuario', async () => {
    const token1 = await getToken()
    const token2 = await getToken(0)
    const initialContent = await getContent(token1)
    const res = await api.delete('/api/users')
      .auth(token1, { type: 'bearer' })
      .expect(200)
      .expect('Content-Type', /json/)
    const content = await getContent(token2)
    expect(content.length).toBe(initialContent.length - 1)
    expect(res.body.data.message).toEqual('El usuario Raquel, Ha sido borrado con éxito.')
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
