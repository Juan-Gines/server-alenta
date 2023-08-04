import PostModel from '#Models/post.js'
import { CustomError } from '#Errors/CustomError.js'
import { errorMessageES } from '#Lang/es/errorMessage.js'
import UserModel from '#Models/user.js'
import errObjectId from '#Utils/errObjectId.js'

// * Error messages

const { errEmpyPosts, errEmptyPost, errUnAuthorized } = errorMessageES

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
    const user = await UserModel.findById(userId)
    const postToInsert = {
      ...post,
      user: userId
    }
    const newPost = new PostModel(postToInsert)
    await newPost.save()
    user.posts = user.posts.concat(newPost._id)
    await user.save()
    return newPost
  } catch (error) {
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

// * Update one user and return this users from DB

const updateOnePost = async (userId, changes) => {
  const { id, ...infoToUpdate } = changes
  try {
    const user = await UserModel.findById(userId)
    const isPostFromUser = user.posts.find(p => p.equals(id))
    if (!isPostFromUser) {
      throw new CustomError(401, errUnAuthorized)
    }
    const postForUpdate = await PostModel.findByIdAndUpdate(id, infoToUpdate, { new: true }).populate('user', {
      name: 1,
      surname: 1
    })
    if (!postForUpdate) {
      throw new CustomError(401, errEmptyPost)
    }
    return postForUpdate
  } catch (error) {
    errObjectId(error)
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

// * Delete one user from DB

const deleteOnePost = async (userId, postId) => {
  try {
    const post = await PostModel.findById(postId)
    if (!post) {
      throw new CustomError(404, errEmptyPost)
    }
    if (!post.user.equals(userId)) {
      throw new CustomError(401, errUnAuthorized)
    }
    const postDeleted = await post.deleteOne()
    const pull = { $pull: { posts: postId } }
    await UserModel.findByIdAndUpdate(userId, pull, { new: true })
    return { message: `El post "${postDeleted.name}", ha sido borrado con éxito.` }
  } catch (error) {
    errObjectId(error)
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
