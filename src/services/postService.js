import PostModel from '#Models/post.js'
import { CustomError } from '#Errors/CustomError.js'
import { errorMessageES } from '#Lang/es/errorMessage.js'
import UserModel from '#Models/user.js'
import errObjectId from '#Utils/errObjectId.js'

// ! Error messages

const { errEmptyPosts, errEmptyPost, errUnAuthorized } = errorMessageES

// * Return all posts from DB

const getAllPosts = () => {
  return PostModel.find({})
    .populate('user', {
      name: 1,
      email: 1
    })
    .then(posts => {
      if (!posts?.length) {
        throw new CustomError(404, errEmptyPosts)
      }
      return posts
    })
    .catch(error => {
      throw new CustomError(error?.status ?? 500, error?.message ?? error)
    })
}

// * Return one post from DB

const getOnePost = (postId, user = undefined) => {
  return PostModel.findById(postId)
    .populate(['user', 'images', 'poster'])
    .then(async post => {
      if (!post) {
        if (user) {
          user.posts = user.posts.filter(p => !p.equals(postId))
          await user.save()
        }
        throw new CustomError(404, errEmptyPost)
      }
      return post
    })
    .catch(error => {
      errObjectId(error)
      throw new CustomError(error?.status ?? 500, error?.message ?? error)
    })
}

// * Create one Post and return this post

const createOnePost = async (user, post) => {
  const userToUpdate = new UserModel(user)
  try {
    const postToInsert = {
      ...post,
      user: userToUpdate._id
    }
    const newPost = new PostModel(postToInsert)
    await newPost.save()
    userToUpdate.posts.push(newPost._id)
    await userToUpdate.save()
    return newPost.populate(['poster', 'images', 'user'])
  } catch (error) {
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

// * Update one post and user and return this posts from DB

const updateOnePost = async (changes) => {
  const { id, ...infoToUpdate } = changes
  try {
    const postForUpdate = await PostModel.findByIdAndUpdate(id, infoToUpdate, { new: true })
    return postForUpdate.populate(['user', 'images', 'poster'])
  } catch (error) {
    errObjectId(error)
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

// * Delete one post from DB

const deleteOnePost = async (user, postId) => {
  try {
    const userInspect = UserModel(user)
    const post = await PostModel.findById(postId)
    if (!post) {
      userInspect.posts = userInspect.posts.filter(p => !p.equals(postId))
      await userInspect.save()
      throw new CustomError(404, errEmptyPost)
    }
    if (!post.user.equals(userInspect._id)) {
      throw new CustomError(401, errUnAuthorized)
    }
    const postDeleted = await PostModel.findByIdAndDelete(postId)
    const pull = { $pull: { posts: postId } }
    await UserModel.findByIdAndUpdate(userInspect._id, pull, { new: true })
    return postDeleted
  } catch (error) {
    errObjectId(error)
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

// const asignPostIdOnImages = (images, postId) => {
//   images.map(image => {
//     image.post = postId
//     return image
//   })
//   images.map(async image => await image.save())
//   return images
// }

// const pullIdsFromUser = (postDeleted) => {
//   const { poster, images, _id } = postDeleted
//   const imagesIds = []
//   if (poster) {
//     imagesIds.push(poster)
//   }
//   if (images) {
//     images.map(async image => {
//       imagesIds.push(image)
//     })
//   }
//   if (imagesIds.length > 0) return { $pull: { images: { $in: imagesIds }, posts: _id } }
//   return { $pull: { posts: _id } }
// }

export {
  getAllPosts,
  getOnePost,
  createOnePost,
  updateOnePost,
  deleteOnePost
}
