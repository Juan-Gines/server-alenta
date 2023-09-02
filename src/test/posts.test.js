import mongoose from 'mongoose'
import { api, badUser, getUser } from './helpers/user.js'
import server from '../index.js'
import { badPost, deleteFakePost, fakePostId, getPosts, newPost, postDBInit } from './helpers/posts.js'
import { errorMessageES } from '#Lang/es/errorMessage.js'
import PostModel from '#Models/post.js'
import { arrayImages, getImage, newImage } from './helpers/image.js'

// Errores de la api

const { errEmptyPosts, errEmptyPost, errUnAuthorized, errIdErroneo, errMinLength, errMaxLength, errTypeString, errMaxImages } = errorMessageES
// TODO : reestructurar los test para hacerlos más rápidos

let token, post1, post2

beforeAll(async () => {
  await PostModel.deleteMany({})
})

afterAll(async () => {
  await mongoose.connection.close()
  await server.close()
})

describe('Posts', () => {
  test('GET /api/posts error no existen post', async () => {
    const res = await api
      .get('/api/posts')
      .expect(404)
      .expect('Content-Type', /json/)
    const content = res.body.data.error
    expect(content).toEqual(errEmptyPosts)
  })

  describe('Test no modifican la BD', () => {
    beforeAll(async () => {
      [token, post1, post2] = await postDBInit()
    })

    test('GET /api/posts devuelve todos los post', async () => {
      const res = await api
        .get('/api/posts')
        .expect(200)
        .expect('Content-Type', /json/)
      expect(res.body.data.length).toBe(2)
    })

    test('GET /api/posts/:postId devuelve un post', async () => {
      const res = await api
        .get(`/api/posts/${post1.id}`)
        .expect(200)
        .expect('Content-Type', /json/)
      const content = res.body.data
      expect(content).toHaveProperty('title', 'El post del user 1')
      expect(content).toHaveProperty('body', 'El body del post del user 1')
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

    test('POST /api/posts error creamos un post con mas de 10 imagenes', async () => {
      const res = await api
        .post('/api/posts')
        .auth(token, { type: 'bearer' })
        .send({ ...newPost, images: arrayImages(11), poster: newImage })
        .expect(400)
        .expect('Content-Type', /json/)
      const content = res.body.data.error.map(e => e.message)
      expect(content).toContain(errMaxImages)
    })

    test('POST /api/posts post error minLength', async () => {
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

    test('POST /api/posts post errores de tipo', async () => {
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

    test('PATCH /api/posts/ updateamos un post id errónea', async () => {
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
      const id = post2.id
      const res = await api
        .patch('/api/posts')
        .auth(token, { type: 'bearer' })
        .send({ ...newPost, id })
        .expect(401)
        .expect('Content-Type', /json/)
      const content = res.body.data.error
      expect(content).toEqual(errUnAuthorized)
    })

    test('DELETE /api/posts/:postId error borramos un post de otro usuario', async () => {
      const id = post2.id
      const res = await api
        .delete(`/api/posts/${id}`)
        .auth(token, { type: 'bearer' })
        .expect(401)
        .expect('Content-Type', /json/)
      const content = res.body.data.error
      expect(content).toEqual(errUnAuthorized)
    })
  })

  describe('Test que modifican la base de datos', () => {
    beforeEach(async () => {
      [token, post1, post2] = await postDBInit()
    })

    test('POST /api/posts creamos un post y testeamos la relación del user', async () => {
      const initialPosts = [post1, post2]
      const res = await api
        .post('/api/posts')
        .auth(token, { type: 'bearer' })
        .send(newPost)
        .expect(201)
        .expect('Content-Type', /json/)
      const finalPosts = await getPosts()
      const content = res.body.data
      expect(content).toHaveProperty('title', 'Nuevo post')
      expect(content).toHaveProperty('body', 'Body del nuevo post')
      expect(content).toHaveProperty('extract', 'Extracto del nuevo post')
      expect(content).toHaveProperty('user')
      expect(content).toHaveProperty('id')
      expect(content).toHaveProperty('createdAt')
      expect(content).toHaveProperty('updatedAt')
      expect(finalPosts.length).toBe(initialPosts.length + 1)
      expect(content.user.posts).toContain(content.id)
    })

    test('POST /api/posts creamos un post con imagenes y poster y parametros extra', async () => {
      const initialPosts = [post1, post2]
      const res = await api
        .post('/api/posts')
        .auth(token, { type: 'bearer' })
        .send({ ...newPost, images: arrayImages(2), poster: { ...newImage, hola: 'hola' }, err: 'error' })
        .expect(201)
        .expect('Content-Type', /json/)
      const finalPosts = await getPosts()
      const content = res.body.data
      const poster = getImage(content.poster.id)
      expect(content).toHaveProperty('images')
      expect(content).toHaveProperty('poster')
      expect(content).not.toHaveProperty('hola')
      expect(finalPosts.length).toBe(initialPosts.length + 1)
      content.images.forEach(image => expect(image).toHaveProperty('imageName'))
      expect(poster).not.toHaveProperty('hola')
    })

    test('PATCH /api/posts/ updateamos un post', async () => {
      const id = post1.id
      const res = await api
        .patch('/api/posts')
        .auth(token, { type: 'bearer' })
        .send({ ...newPost, id })
        .expect(200)
        .expect('Content-Type', /json/)
      const content = res.body.data
      expect(content).toHaveProperty('title', 'Nuevo post')
      expect(content).toHaveProperty('body', 'Body del nuevo post')
      expect(content).toHaveProperty('extract', 'Extracto del nuevo post')
      expect(content).toHaveProperty('user')
      expect(content).toHaveProperty('id')
      expect(content).toHaveProperty('createdAt')
      expect(content).toHaveProperty('updatedAt')
    })

    test('PATCH /api/posts/ updateamos un post con imagenes y poster', async () => {
      const id = post1.id
      const res = await api
        .patch('/api/posts')
        .auth(token, { type: 'bearer' })
        .send({ ...newPost, images: arrayImages(2), poster: newImage, id })
        .expect(200)
        .expect('Content-Type', /json/)
      const content = res.body.data
      expect(content).toHaveProperty('images')
      expect(content).toHaveProperty('poster')
      expect(content.poster).toHaveProperty('post')
      expect(content.poster).toHaveProperty('imageName')
      content.images.forEach(image => expect(image).toHaveProperty('post'))
      content.images.forEach(image => expect(image).toHaveProperty('imageName'))
    })

    test('PATCH /api/posts/ error updateamos un post con imagenes metiéndole más de 10 en total', async () => {
      const id = post1.id
      await api
        .patch('/api/posts')
        .auth(token, { type: 'bearer' })
        .send({ ...newPost, images: arrayImages(4), poster: newImage, id })
      const res = await api
        .patch('/api/posts')
        .auth(token, { type: 'bearer' })
        .send({ ...newPost, images: arrayImages(7), poster: newImage, id })
        .expect(400)
        .expect('Content-Type', /json/)
      const content = res.body.data.error
      expect(content).toEqual(errMaxImages)
    })

    test('PATCH /api/posts/ error updateamos un post inexistente y nos aseguramos que se borra la relación con el usuario', async () => {
      const id = post1.id
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
      const id = post1.id
      const res = await api
        .delete(`/api/posts/${id}`)
        .auth(token, { type: 'bearer' })
        .expect(200)
        .expect('Content-Type', /json/)
      const content = res.body.data
      expect(content).toHaveProperty('user')
      expect(content).toHaveProperty('title')
      expect(content).toHaveProperty('extract')
      expect(content).toHaveProperty('body')
    })

    test('DELETE /api/posts/:postId error borramos un post inexistente', async () => {
      const id = post1.id
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
})
