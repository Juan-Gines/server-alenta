import PostModel from '#Models/post.js'
import { CustomError } from '#Errors/CustomError.js'
import { errorMessageES } from '#Lang/es/errorMessage.js'

// * Error messages

const { errEmpyPosts, errEmptyPost } = errorMessageES
// * Return all users from DB

const getAllPosts = async () => {
  try {
    const posts = await PostModel.find({})
      .populate('user', {
        name: 1,
        email: 1
      })

    if (posts.length === 0) {
      throw new CustomError(404, errEmpyPosts)
    }
    return posts
  } catch (error) {
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

// * Return one user from DB

const getOnePost = async (postId) => {
  try {
    const post = PostModel.findById(postId)
      .populate('user', {
        name: 1,
        email: 1
      })
    if (!post) {
      throw new CustomError(404, errEmptyPost)
    }
    return post
  } catch (error) {
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

// * Create one Post and return this post

const createOnePost = async (userId, post) => {
  try {
    const userForUpdate = await PostModel.findByIdAndUpdate(userId, post, { new: true })
    if (!userForUpdate) {
      throw new CustomError(404, errEmptyPost)
    }
    return userForUpdate
  } catch (error) {
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

// * Update one user and return this users from DB

const updateOnePost = async (userId, changes) => {
  try {
    const userForUpdate = await PostModel.findByIdAndUpdate(userId, changes, { new: true })
    if (!userForUpdate) {
      throw new CustomError(404, errEmptyPost)
    }
    return userForUpdate
  } catch (error) {
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

// * Delete one user from DB

const deleteOnePost = async (userId) => {
  try {
    const userDeleted = await PostModel.findByIdAndDelete(userId)
    if (!userDeleted) {
      throw new CustomError(404, errEmptyPost)
    }
    return { message: `El usuario ${userDeleted.name}, Ha sido borrado con éxito.` }
  } catch (error) {
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

export default {
  getAllPosts,
  getOnePost,
  createOnePost,
  updateOnePost,
  deleteOnePost
}
