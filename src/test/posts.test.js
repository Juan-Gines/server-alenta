import mongoose from 'mongoose'
import { api, badUser, getToken, getUser } from './helpers/user.js'
import server from '../index.js'
import { badPost, deleteFakePost, fakePostId, getIdFromPost, getPosts, newPost, postDBInit } from './helpers/posts.js'
import { errorMessageES } from '#Lang/es/errorMessage.js'
import PostModel from '#Models/post.js'

// Errores de la api

const { errEmptyPosts, errEmptyPost, errUnAuthorized, errIdErroneo, errMinLength, errMaxLength, errTypeString } = errorMessageES

beforeEach(async () => {
  await postDBInit()
})

afterAll(async () => {
  await mongoose.connection.close()
  await server.close()
})

describe('Posts', () => {
  test('GET /api/posts devuelve todos los post', async () => {
    const res = await api
      .get('/api/posts')
      .expect(200)
      .expect('Content-Type', /json/)
    expect(res.body.data.length).toBe(2)
  })

  test('GET /api/posts error no existen post', async () => {
    await PostModel.deleteMany({})
    const res = await api
      .get('/api/posts')
      .expect(404)
      .expect('Content-Type', /json/)
    const content = res.body.data.error
    expect(content).toEqual(errEmptyPosts)
  })

  test('GET /api/posts/:postId devuelve un post', async () => {
    const id = await getIdFromPost()
    const res = await api
      .get(`/api/posts/${id}`)
      .expect(200)
      .expect('Content-Type', /json/)
    const content = res.body.data
    expect(content).toHaveProperty('title', 'El primer post del user 1')
    expect(content).toHaveProperty('body', 'El body del primer post del user 1')
    expect(content).toHaveProperty('user')
  })

  test('GET /api/posts/:postId error post id erróneo', async () => {
    const id = 'jkf'
    const res = await api
      .get(`/api/posts/${id}`)
      .expect(404)
      .expect('Content-Type', /json/)
    const content = res.body.data.error
    expect(content).toEqual(errIdErroneo)
  })

  test('GET /api/posts/:postId error post el post no existe', async () => {
    const id = fakePostId
    const res = await api
      .get(`/api/posts/${id}`)
      .expect(404)
      .expect('Content-Type', /json/)
    const content = res.body.data.error
    expect(content).toEqual(errEmptyPost)
  })

  test('POST /api/posts creamos un post y testeamos la relación del user', async () => {
    const token = await getToken(0)
    const initialPosts = await getPosts()
    const res = await api
      .post('/api/posts')
      .auth(token, { type: 'bearer' })
      .send(newPost)
      .expect(201)
      .expect('Content-Type', /json/)
    const finalPosts = await getPosts()
    const user = await getUser(token)
    const content = res.body.data
    expect(content).toHaveProperty('title', 'Nuevo post')
    expect(content).toHaveProperty('body', 'Body del nuevo post')
    expect(content).toHaveProperty('user')
    expect(content).toHaveProperty('id')
    expect(content).toHaveProperty('createdAt')
    expect(content).toHaveProperty('updatedAt')
    expect(finalPosts.length).toBe(initialPosts.length + 1)
    expect(user.posts).toContain(content.id)
  })
  test('POST /api/posts post error minLength', async () => {
    const token = await getToken(0)
    const res = await api
      .post('/api/posts')
      .auth(token, { type: 'bearer' })
      .send({ title: badPost.errMinText, body: badPost.errMinText })
      .expect(400)
      .expect('Content-Type', /json/)
    const content = res.body.data.error.map(d => d.message)
    expect(content[0]).toContain(errMinLength(4))
    expect(content[1]).toContain(errMinLength(4))
  })

  test('POST /api/posts post error maxLength', async () => {
    const token = await getToken(0)
    const res = await api
      .post('/api/posts')
      .auth(token, { type: 'bearer' })
      .send({ title: badPost.errLongText, body: badPost.errLongText })
      .expect(400)
      .expect('Content-Type', /json/)
    const content = res.body.data.error.map(d => d.message)
    expect(content[0]).toContain(errMaxLength(50))
    expect(content[1]).toContain(errMaxLength(1000))
  })

  test('POST /api/posts post errores de typo', async () => {
    const token = await getToken(0)
    const res = await api
      .post('/api/posts')
      .auth(token, { type: 'bearer' })
      .send({ title: badUser.type, body: badUser.type })
      .expect(400)
      .expect('Content-Type', /json/)
    const content = res.body.data.error.map(d => d.message)
    expect(content[0]).toContain(errTypeString)
    expect(content[1]).toContain(errTypeString)
  })

  test('PATCH /api/posts/ updateamos un post', async () => {
    const token = await getToken(0)
    const id = await getIdFromPost(0)
    const res = await api
      .patch('/api/posts')
      .auth(token, { type: 'bearer' })
      .send({ ...newPost, id })
      .expect(200)
      .expect('Content-Type', /json/)
    const content = res.body.data
    expect(content).toHaveProperty('title', 'Nuevo post')
    expect(content).toHaveProperty('body', 'Body del nuevo post')
    expect(content).toHaveProperty('user')
    expect(content).toHaveProperty('id')
    expect(content).toHaveProperty('createdAt')
    expect(content).toHaveProperty('updatedAt')
  })

  test('PATCH /api/posts/ updateamos un post id errónea', async () => {
    const token = await getToken(0)
    const id = 'kjg'
    const res = await api
      .patch('/api/posts')
      .auth(token, { type: 'bearer' })
      .send({ ...newPost, id })
      .expect(400)
      .expect('Content-Type', /json/)
    const content = res.body.data.error.map(d => d.message)
    expect(content[0]).toEqual(errIdErroneo)
  })

  test('PATCH /api/posts/ updateamos un post id con error de tipo', async () => {
    const token = await getToken(0)
    const id = badUser.type
    const res = await api
      .patch('/api/posts')
      .auth(token, { type: 'bearer' })
      .send({ ...newPost, id })
      .expect(400)
      .expect('Content-Type', /json/)
    const content = res.body.data.error.map(d => d.message)
    expect(content[0]).toEqual(errTypeString)
  })

  test('PATCH /api/posts/ error updateamos un post de otro usuario', async () => {
    const token = await getToken(0)
    const id = await getIdFromPost(1)
    const res = await api
      .patch('/api/posts')
      .auth(token, { type: 'bearer' })
      .send({ ...newPost, id })
      .expect(401)
      .expect('Content-Type', /json/)
    const content = res.body.data.error
    expect(content).toEqual(errUnAuthorized)
  })

  test('PATCH /api/posts/ error updateamos un post inexistente y nos aseguramos que se borra la relación con el usuario', async () => {
    const token = await getToken(0)
    const id = await getIdFromPost(0)
    const initialUser = await getUser(token)
    await deleteFakePost(id)
    const res = await api
      .patch('/api/posts')
      .auth(token, { type: 'bearer' })
      .send({ ...newPost, id })
      .expect(404)
      .expect('Content-Type', /json/)
    const res2 = await api
      .patch('/api/posts')
      .auth(token, { type: 'bearer' })
      .send({ ...newPost, id })
      .expect(401)
      .expect('Content-Type', /json/)
    const afterUser = await getUser(token)
    const content = res.body.data.error
    const content2 = res2.body.data.error
    expect(content).toEqual(errEmptyPost)
    expect(content2).toEqual(errUnAuthorized)
    expect(initialUser.posts.length).toBe(1)
    expect(afterUser.posts.length).toBe(0)
  })

  test('DELETE /api/posts/:postId borramos un post', async () => {
    const token = await getToken(0)
    const id = await getIdFromPost(0)
    const res = await api
      .delete(`/api/posts/${id}`)
      .auth(token, { type: 'bearer' })
      .expect(200)
      .expect('Content-Type', /json/)
    const content = res.body.data.message
    expect(content).toEqual('El post "El primer post del user 1", ha sido borrado con éxito.')
  })

  test('DELETE /api/posts/:postId error borramos un post de otro usuario', async () => {
    const token = await getToken(0)
    const id = await getIdFromPost(1)
    const res = await api
      .delete(`/api/posts/${id}`)
      .auth(token, { type: 'bearer' })
      .expect(401)
      .expect('Content-Type', /json/)
    const content = res.body.data.error
    expect(content).toEqual(errUnAuthorized)
  })

  test('DELETE /api/posts/:postId error borramos un post inexistente', async () => {
    const token = await getToken(0)
    const id = await getIdFromPost(0)
    const initialUser = await getUser(token)
    await deleteFakePost(id)
    const res = await api
      .delete(`/api/posts/${id}`)
      .auth(token, { type: 'bearer' })
      .expect(404)
      .expect('Content-Type', /json/)
    const afterUser = await getUser(token)
    const content = res.body.data.error
    expect(content).toEqual(errEmptyPost)
    expect(initialUser.posts.length).toBe(1)
    expect(afterUser.posts.length).toBe(0)
  })
})
