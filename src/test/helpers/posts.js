import PostModel from '#Models/post.js'
import { api, getToken, userDBInit } from './user.js'

// Post iniciales para la BD

const initialPosts = [
  {
    name: 'El primer post del user 1',
    body: 'El body del primer post del user 1'
  },
  {
    name: 'El segundo post del user 1',
    body: 'El body del segundo post del user 1'
  },
  {
    name: 'El primer post del user 2',
    body: 'El body del primer post del user 2'
  },
  {
    name: 'El segundo post del user 2',
    body: 'El body del segundo post del user 2'
  }
]

// Datos para insertar un nuevo post

const newPost = {
  name: 'Nuevo post',
  body: 'Body del nuevo post'
}

// Id de un post inexistente

const fakePostId = '64cf7548a22457137656ee5d'

// Iniciamos la BD con 4 registros de 2 usuarios

const postDBInit = async () => {
  await userDBInit()
  await PostModel.deleteMany({})
  const token1 = await getToken(0)
  const token2 = await getToken(1)
  await insertPost(token1, initialPosts[0])
  await insertPost(token1, initialPosts[1])
  await insertPost(token2, initialPosts[2])
  await insertPost(token2, initialPosts[3])
}

// Inserta un post dentro de la DB

const insertPost = async (token, post) => {
  await api
    .post('/api/posts')
    .auth(token, { type: 'bearer' })
    .send(post)
}

// Recupera la id de un post

const getIdFromPost = async (post = 0) => {
  const res = await api.get('/api/posts')
  const content = res.body.data
  return content[post].id
}

// Recuperamos todos los posts de la DB

const getPosts = async () => {
  const res = await api.get('/api/posts')
  const content = res.body.data
  return content
}

// Borramos un post de la BD dejando la id en el usuario

const deleteFakePost = async (id) => {
  const post = PostModel.findById(id)
  await post.deleteOne()
}

export {
  postDBInit,
  getIdFromPost,
  newPost,
  getPosts,
  fakePostId,
  deleteFakePost
}
