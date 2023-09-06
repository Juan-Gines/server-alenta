import ImageModel from '#Models/image.js'
import PostModel from '#Models/post.js'
import UserModel from '#Models/user.js'
import { arrayImages, newImage } from './image.js'
import { newPost } from './posts.js'
import { api, getToken, initialUsers, insertUser } from './user.js'

const initialDB = async () => {
  await UserModel.deleteMany({})
  await PostModel.deleteMany({})
  await ImageModel.deleteMany({})
  await insertUser(initialUsers[0])
  const token = await getToken(0)
  const user = await api.patch('/api/users/personaldata')
    .auth(token, { type: 'bearer' })
    .send({ name: 'Fulano', surname: 'De Tal', avatar: { imageName: 'imagen.jpg', path: '/src/image/avatar', bytes: 550, avatar: true } })
  const post = await api.post('/api/posts')
    .auth(token, { type: 'bearer' })
    .send({ ...newPost, images: arrayImages(2), poster: newImage })
  return [user.body.data, token, post.body.data]
}

export {
  initialDB
}
