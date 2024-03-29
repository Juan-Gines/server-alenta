import server from '../../index.js'
import mongoose from 'mongoose'
import { errorMessageES } from '#Lang/es/errorMessage.js'
import { api, badUser, errTokenExpired, errTokenNoUser, getUsers, getToken, initialUsers, passwordChange, userDBInit, userToInsert } from './helpers/user.js'

const error = errorMessageES

let users, token1, token2

afterAll(async () => {
  await mongoose.connection.close()
  await server.close()
})

describe('auth', () => {
  describe('Test no modifican la BD', () => {
    beforeAll(async () => {
      users = await userDBInit()
      token1 = await getToken()
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

    test('POST api/auth/login email inexistente incorrecta', async () => {
      const user = { email: 'gargamel@test.com', password: 'Test1234' }
      const res = await api.post('/api/auth/login')
        .send(user)
        .expect(401)
        .expect('Content-Type', /json/)
      const data = res.body.data.error
      expect(data).toContain(error.errLogin)
    })

    test('POST api/auth/login password incorrecta', async () => {
      const user = { email: 'raquel@test.com', password: 'Test12345678' }
      const res = await api.post('/api/auth/login')
        .send(user)
        .expect(401)
        .expect('Content-Type', /json/)
      const data = res.body.data.error
      expect(data).toContain(error.errLogin)
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
      const user = { email: 'raquel@test.com', password: 'Test1234', name: 'Raquel', hola: 'hola' }
      const res = await api
        .post('/api/auth/login')
        .send(user)
        .expect(200)
        .expect('Content-Type', /json/)
      const content = res.body.data
      expect(content).toHaveProperty('token')
    })

    test('PATCH api/auth/password evalua el viejo password incorrecto', async () => {
      const res = await api
        .patch('/api/auth/password')
        .auth(token1, { type: 'bearer' })
        .send({ oldPassword: 'Test1254542', newPassword: 'Testfsd545411' })
        .expect(401)
        .expect('Content-Type', /json/)
      expect(res.body.data.error).toEqual(error.errLogin)
    }, 0)

    test('PATCH api/auth/password error newPassword y oldPassword requerido', async () => {
      const newPass = { }
      const res = await api
        .patch('/api/auth/password')
        .auth(token1, { type: 'bearer' })
        .send(newPass)
        .expect(400)
        .expect('Content-Type', /json/)
      const content = res.body.data.error.map(d => d.message)
      expect(content).toContain(error.errRequired('antiguo password'))
      expect(content).toContain(error.errRequired('nuevo password'))
    })

    test('PATCH api/auth/password error newPassword y oldPassword iguales', async () => {
      const newPass = { oldPassword: 'Test1234', newPassword: 'Test1234' }
      const res = await api
        .patch('/api/auth/password')
        .auth(token1, { type: 'bearer' })
        .send(newPass)
        .expect(400)
        .expect('Content-Type', /json/)
      const content = res.body.data.error
      expect(content).toContain(error.errNewPassEqualToOld)
    })
  })

  describe('Test que modifican la base de datos', () => {
    beforeEach(async () => {
      users = await userDBInit()
      token1 = await getToken()
    })

    test('POST api/auth/register guarda un usuario', async () => {
      const res = await api
        .post('/api/auth/register')
        .send(userToInsert)
        .expect(201)
        .expect('Content-Type', /json/)
      const finalUsers = await getUsers(token1)
      const newPost = res.body.data
      expect(newPost).toHaveProperty('name')
      expect(newPost).toHaveProperty('email')
      expect(newPost).toHaveProperty('role')
      expect(newPost).toHaveProperty('updatedAt')
      expect(newPost).toHaveProperty('createdAt')
      expect(newPost).toHaveProperty('id')
      expect(finalUsers.length).toBe(users.length + 1)
    })

    test('POST api/auth/register guarda un usuario con body sin trim', async () => {
      const { trimEmailValue, trimNameValue, trimPassValue } = badUser
      const user = { '   email   ': trimEmailValue, '   name   ': trimNameValue, '   password   ': trimPassValue }
      const res = await api
        .post('/api/auth/register')
        .send(user)
        .expect(201)
        .expect('Content-Type', /json/)
      const finalUsers = await getUsers(token1)
      const newPost = res.body.data
      expect(newPost).toHaveProperty('name')
      expect(newPost).toHaveProperty('email')
      expect(newPost).toHaveProperty('role')
      expect(newPost).toHaveProperty('updatedAt')
      expect(newPost).toHaveProperty('createdAt')
      expect(newPost).toHaveProperty('id')
      expect(finalUsers.length).toBe(users.length + 1)
    })

    test('POST api/auth/register body con parámetros de más', async () => {
      const user = { ...userToInsert, hola: 'error' }
      const res = await api
        .post('/api/auth/register')
        .send(user)
        .expect(201)
        .expect('Content-Type', /json/)
      const content = res.body.data
      expect(content).toHaveProperty('name', 'manuel')
      expect(content).not.toHaveProperty('hola')
    })

    test('PATCH api/auth/password evalua el viejo password y lo cambia', async () => {
      const res = await api
        .patch('/api/auth/password')
        .auth(token1, { type: 'bearer' })
        .send(passwordChange)
        .expect(200)
        .expect('Content-Type', /json/)
      expect(res.body.data.message).toEqual('El password de Raquel se cambió correctamente.')
    }, 0)

    test('PATCH api/auth/password error parámetros de más', async () => {
      const newPass = { ...passwordChange, hola: 'TREe4533' }
      const res = await api
        .patch('/api/auth/password')
        .auth(token1, { type: 'bearer' })
        .send(newPass)
        .expect(200)
        .expect('Content-Type', /json/)
      expect(res.body.data.message).toEqual('El password de Raquel se cambió correctamente.')
    })
  })
})

describe('user', () => {
  describe('Test no modifican la BD', () => {
    beforeAll(async () => {
      users = await userDBInit()
      token1 = await getToken()
    })

    test('GET /api/users recupera los registros de user', async () => {
      const res = await api.get('/api/users')
        .auth(token1, { type: 'bearer' })
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
      const errToken = token1.slice(0, -2)
      const res = await api.get('/api/users')
        .auth(errToken, { type: 'bearer' })
        .expect(401)
        .expect('Content-Type', /json/)
      const content = res.body.data.error
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
      const res = await api.get('/api/users')
        .auth(errTokenExpired, { type: 'bearer' })
        .expect(401)
        .expect('Content-Type', /json/)
      const content = res.body.data.error
      expect(content).toContain('jwt expired')
    })

    test('GET /api/users token con usuario inexistente', async () => {
      const res = await api.get('/api/users')
        .auth(errTokenNoUser, { type: 'bearer' })
        .expect(401)
        .expect('Content-Type', /json/)
      const content = res.body.data.error
      expect(content).toContain(error.errUnAuthorized)
    })

    test('GET /api/users/profile recupera los registgros de un usuario', async () => {
      const res = await api.get('/api/users/profile')
        .auth(token1, { type: 'bearer' })
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

    test('PATCH /api/users/personaldata error requeridos', async () => {
      const res = await api.patch('/api/users/personaldata')
        .auth(token1, { type: 'bearer' })
        .send({ })
        .expect(400)
        .expect('Content-Type', /json/)
      const content = res.body.data.error.map(d => d.message)
      expect(content).toContain(error.errRequired('nombre'))
      expect(content).toContain(error.errRequired('apellidos'))
    })

    test('PATCH /api/users/personaldata error apellidos min', async () => {
      const res = await api.patch('/api/users/personaldata')
        .auth(token1, { type: 'bearer' })
        .send({ surname: badUser.minLength })
        .expect(400)
        .expect('Content-Type', /json/)
      const content = res.body.data.error.map(d => d.message)
      expect(content).toContain(error.errMinLength(4))
    })

    test('PATCH /api/users/personaldata error apellidos max', async () => {
      const res = await api.patch('/api/users/personaldata')
        .auth(token1, { type: 'bearer' })
        .send({ surname: badUser.maxLength })
        .expect(400)
        .expect('Content-Type', /json/)
      const content = res.body.data.error.map(d => d.message)
      expect(content).toContain(error.errMaxLength(50))
    })

    test('PATCH /api/users/personaldata error apellidos de tipo', async () => {
      const res = await api.patch('/api/users/personaldata')
        .auth(token1, { type: 'bearer' })
        .send({ surname: badUser.type })
        .expect(400)
        .expect('Content-Type', /json/)
      const content = res.body.data.error.map(d => d.message)
      expect(content).toContain(error.errTypeString)
    })

    test('PATCH /api/users/personaldata error requeridos dentro de avatar', async () => {
      const res = await api.patch('/api/users/personaldata')
        .auth(token1, { type: 'bearer' })
        .send({ name: 'Fulano', surname: 'De Tal', avatar: { } })
        .expect(400)
        .expect('Content-Type', /json/)
      const content = res.body.data.error.map(e => e.message)
      expect(content).toContain(error.errRequired('imageName'))
      expect(content).toContain(error.errRequired('path'))
      expect(content).toContain(error.errRequired('bytes'))
    })

    test('PATCH /api/users/personaldata error avatar props min', async () => {
      const res = await api.patch('/api/users/personaldata')
        .auth(token1, { type: 'bearer' })
        .send({ name: 'Fulano', surname: 'De Tal', avatar: { imageName: 'ima', path: '/sr', bytes: 5, avatar: true } })
        .expect(400)
        .expect('Content-Type', /json/)
      const content = res.body.data.error.map(d => d.message)
      expect(content).toContain(error.errMinLength(4))
      expect(content).toContain(error.errMinimum(10))
    })

    test('PATCH /api/users/personaldata error avatar tipo', async () => {
      const res = await api.patch('/api/users/personaldata')
        .auth(token1, { type: 'bearer' })
        .send({ name: 'Fulano', surname: 'De Tal', avatar: 'hola' })
        .expect(400)
        .expect('Content-Type', /json/)
      const content = res.body.data.error.map(e => e.message)
      expect(content).toContain(error.errTypeObject)
    })
  })

  describe('Test que modifican la base de datos', () => {
    beforeEach(async () => {
      users = await userDBInit()
      token1 = await getToken()
      token2 = await getToken(0)
    })

    test('PATCH /api/users/personaldata updatea el nombre y los apellidos', async () => {
      const res = await api.patch('/api/users/personaldata')
        .auth(token1, { type: 'bearer' })
        .send({ name: 'Fulano', surname: 'De Tal' })
        .expect(200)
        .expect('Content-Type', /json/)
      const content = res.body.data
      expect(content).toHaveProperty('name', 'Fulano')
      expect(content).toHaveProperty('surname', 'De Tal')
    })

    test('PATCH /api/users/personaldata updatea la info con imagen', async () => {
      const res = await api.patch('/api/users/personaldata')
        .auth(token1, { type: 'bearer' })
        .send({ name: 'Fulano', surname: 'De Tal', avatar: { imageName: 'imagen.jpg', path: '/src/image/avatar', bytes: 550, avatar: true } })
        .expect(200)
        .expect('Content-Type', /json/)
      const content = res.body.data
      expect(content).toHaveProperty('avatar')
      expect(content.avatar).toHaveProperty('path')
      expect(content.avatar).toHaveProperty('imageName')
    })

    test('PATCH /api/users/personaldata avatar con parámetros de más', async () => {
      const res = await api.patch('/api/users/personaldata')
        .auth(token1, { type: 'bearer' })
        .send({ name: 'Fulano', surname: 'De Tal', hola: 'fjksdf', avatar: { imageName: 'imagen.jpg', path: '/src/image/avatar', bytes: 550, avatar: true, hola: 'hola' } })
        .expect(200)
        .expect('Content-Type', /json/)
      const content = res.body.data
      expect(content).toHaveProperty('name', 'Fulano')
      expect(content).toHaveProperty('surname', 'De Tal')
      expect(content).toHaveProperty('avatar')
      expect(content).not.toHaveProperty('hola')
    })

    test('DELETE /api/users Borra un usuario', async () => {
      const res = await api.delete('/api/users')
        .auth(token1, { type: 'bearer' })
        .expect(200)
        .expect('Content-Type', /json/)
      const content = await getUsers(token2)
      expect(content.length).toBe(users.length - 1)
      expect(res.body.data).toHaveProperty('name')
    })
  })
})
