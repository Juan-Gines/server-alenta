import supertest from 'supertest'
import expressApp from '#Config/express.js'
import UserModel from '#Models/user.js'

const api = supertest(expressApp)

// Casos de uso de errores

const badUser = Object.freeze({
  minLength: 'Te3',
  maxLength: 'lkfdhsfgdjlskhhsfdglkñjghfsdñgdfshñlkjfsdhgfdsñlkjfsdñlkgjhlkfdjñfdjklfldksjsflkgjflkfdjfldkñT4',
  badEmail: 'fdfdfd',
  badPassMinLength: 'Tefsa',
  nonexistenEmail: 'mario@hotmail.com',
  uniqueEmail: 'juan@hotmail.com',
  type: { hola: 'malo' },
  trimEmailValue: ' manuel@test.com  ',
  trimPassValue: ' Test1234  ',
  trimNameValue: ' manuel  '
})

// Usuarios iniciales para el test

const initialUsers = [
  {
    name: 'Juan',
    email: 'juan@test.com',
    password: '$2b$10$mDMKNGA3vuF8hoE9AxzcQe94LRqB4kQEVyAmCIv3pAwbzNHmNETNu'
  },
  {
    name: 'Raquel',
    email: 'raquel@test.com',
    password: '$2b$10$mDMKNGA3vuF8hoE9AxzcQe94LRqB4kQEVyAmCIv3pAwbzNHmNETNu'
  }
]

// Usuario nuevo para insertar

const userToInsert = {
  name: 'manuel',
  email: 'manuel@test.com',
  password: 'Test1234'
}

// Info para cambiar el password

const passwordChange = {
  oldPassword: 'Test1234',
  newPassword: 'Test123456'
}

// Token erroneo

const errTokenExpired = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzExNDRhNDNmNmRlZmZlYTI5NGRmZCIsInVzZXJuYW1lIjoiSnVhbiIsImlhdCI6MTY5MDQ4NDc3NSwiZXhwIjoxNjkwNDg4Mzc1fQ.ntB8VXmGWSFc0h0jPALnH6aG8C0j8-5WKaG3wJDhCgc'

// Token usuario no existe

const errTokenNoUser = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzQzZDE2MGEwNjI4ZDUxMmIxMTljNiIsInVzZXJuYW1lIjoiTWlndWVsIiwiaWF0IjoxNjkwNjM2NTkzfQ.KziBbN8ySE58YbIIOE3-8XbUM0JHyw6_jyGe5cUBMrM'

// Iniciamos la base de datos con 2 usuarios

const userDBInit = async () => {
  await UserModel.deleteMany({})
  const newUser1 = new UserModel(initialUsers[0])
  await newUser1.save()
  const newUser2 = new UserModel(initialUsers[1])
  await newUser2.save()
}

// Obtener token

const getToken = async (num = 1) => {
  const login = await api.post('/api/auth/login').send({
    email: initialUsers[num].email,
    password: userToInsert.password
  })
  return login.body.data.token
}

// Obtener un get all users

const getUsers = async (token) => {
  const content = await api.get('/api/users')
    .auth(token, { type: 'bearer' })
  return content.body.data
}

// Obtener un usuario en concreto

const getUser = async (token) => {
  const content = await api.get('/api/users/profile')
    .auth(token, { type: 'bearer' })
  return content.body.data
}

export {
  api,
  userDBInit,
  badUser,
  initialUsers,
  userToInsert,
  passwordChange,
  getToken,
  errTokenExpired,
  errTokenNoUser,
  getUsers,
  getUser
}