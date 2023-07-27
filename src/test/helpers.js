import { api } from './users.test.js'

// Casos de uso de errores

export const badUser = Object.freeze({
  minLength: 'Te3',
  maxLength: 'lkfdhsfgdjlskhhsfdglkñjghfsdñgdfshñlkjfsdhgfdsñlkjfsdñlkgjhlkfdjñfdjklfldksjsflkgjflkfdjfldkñT4',
  badEmail: 'fdfdfd',
  badPassMinLength: 'Tefsa',
  nonexistenEmail: 'mario@hotmail.com',
  uniqueEmail: 'juan@hotmail.com',
  type: { hola: 'malo' }
})

// Usuarios iniciales para el test

export const initialUsers = [
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

export const userToInsert = {
  name: 'manuel',
  email: 'manuel@test.com',
  password: 'Test1234'
}

// Info para cambiar el password

export const passwordChange = {
  oldPassword: 'Test1234',
  newPassword: 'Test123456'
}

// Obtener token

export const getToken = async () => {
  const login = await api.post('/api/auth/login').send({
    email: initialUsers[1].email,
    password: userToInsert.password
  })
  return login.body.data.token
}

// Token erroneo

export const errToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzExNDRhNDNmNmRlZmZlYTI5NGRmZCIsInVzZXJuYW1lIjoiSnVhbiIsImlhdCI6MTY5MDQ4NzM1OCwiZXhwIjoxNjkwNDkwOTU4fQ.mmz5v6XewPIpyQpmE6AOv8YUFznSbZOdKEcyMDhEAAM'

// Obtener un get all

export const getContent = async (token) => {
  const content = await api.get('/api/users')
    .auth(token, { type: 'bearer' })
  return content.body.data
}
