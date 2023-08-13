import PostModel from '#Models/post.js'
import { CustomError } from '#Errors/CustomError.js'
import { errorMessageES } from '#Lang/es/errorMessage.js'
import UserModel from '#Models/user.js'
import errObjectId from '#Utils/errObjectId.js'
import ImageModel from '#Models/image.js'

// * Error messages

const { errEmptyImages, errEmptyImage, errUnAuthorized } = errorMessageES

// * Return all images from DB

const getAllImages = () => {
  return ImageModel.find({})
    .populate('user', {
      name: 1,
      email: 1
    })
    .then(images => {
      if (!images?.length) {
        throw new CustomError(404, errEmptyImages)
      }
      return images
    })
    .catch(error => {
      throw new CustomError(error?.status ?? 500, error?.message ?? error)
    })
}

// * Return one image from DB

const getOneImage = (imageId) => {
  return ImageModel.findById(imageId)
    .populate('user', {
      name: 1,
      email: 1
    })
    .exec()
    .then(image => {
      if (!image) {
        throw new CustomError(404, errEmptyImage)
      }
      return image
    })
    .catch(error => {
      errObjectId(error)
      throw new CustomError(error?.status ?? 500, error?.message ?? error)
    })
}

// * Create one Image and return this image

const createOneImage = async (userId, image) => {
  try {
    const user = await UserModel.findById(userId)
    const imageToInsert = {
      ...image,
      user: userId
    }
    const newImage = new ImageModel(imageToInsert)
    await newImage.save()
    if (image.avatar) {
      if (user.avatar) await ImageModel.findByIdAndDelete(user.avatar)
      user.avatar = newImage._id
    } else {
      user.images.push(newImage._id)
    }
    await user.save()
    return newImage
  } catch (error) {
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

// * Update one user and return this users from DB

const updateOneImage = async (userId, changes) => {
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
      user.posts = user.posts.filter(p => !p.equals(id))
      await user.save()
      throw new CustomError(404, errEmptyImage)
    }
    return postForUpdate
  } catch (error) {
    errObjectId(error)
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

// * Delete one user from DB

const deleteOneImage = async (userId, postId) => {
  try {
    const post = await PostModel.findById(postId)
    if (!post) {
      const user = await UserModel.findById(userId)
      user.posts = user.posts.filter(p => !p.equals(postId))
      await user.save()
      throw new CustomError(404, errEmptyImage)
    }
    if (!post.user.equals(userId)) {
      throw new CustomError(401, errUnAuthorized)
    }
    const postDeleted = await post.deleteOne()
    const pull = { $pull: { posts: postId } }
    await UserModel.findByIdAndUpdate(userId, pull, { new: true })
    return { message: `El post "${postDeleted.title}", ha sido borrado con éxito.` }
  } catch (error) {
    errObjectId(error)
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

export default {
  getAllImages,
  getOneImage,
  createOneImage,
  updateOneImage,
  deleteOneImage
}
