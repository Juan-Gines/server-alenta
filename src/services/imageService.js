import { CustomError } from '#Errors/CustomError.js'
import { errorMessageES } from '#Lang/es/errorMessage.js'
import errObjectId from '#Utils/errObjectId.js'
import ImageModel from '#Models/image.js'

// * Error messages

const { errEmptyImages, errEmptyImage } = errorMessageES

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
    const imageToInsert = {
      ...image,
      user: userId
    }
    const newImage = new ImageModel(imageToInsert)
    await newImage.save()
    return newImage
  } catch (error) {
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

//* Crear varias imagenes

const createImages = (userId, images) => {
  return Promise
    .all(images.map(image => createOneImage(userId, image)))
    .then(createdImages => createdImages)
    .catch((error) => {
      throw new CustomError(error?.status ?? 500, error?.message ?? error)
    })
}

// * Update one image and return this image

const updateOneImage = async (imageId, changes) => {
  try {
    const imageUpdated = await ImageModel.findByIdAndUpdate(imageId, changes, { new: true })
    if (!imageUpdated) {
      throw new CustomError(404, errEmptyImage)
    }
    return imageUpdated
  } catch (error) {
    errObjectId(error)
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

//* Updatear varias imagenes

const updateImages = (images, changes) => {
  return Promise
    .all(images.map(image => updateOneImage(image, changes)))
    .then(updatedImages => updatedImages)
    .catch((error) => {
      throw new CustomError(error?.status ?? 500, error?.message ?? error)
    })
}

// * Delete one image from DB

const deleteOneImage = async (imageId) => {
  try {
    const image = await ImageModel.findById(imageId)
    if (!image) {
      throw new CustomError(404, errEmptyImage)
    }
    const imageDeleted = await image.deleteOne()
    return imageDeleted
  } catch (error) {
    errObjectId(error)
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

const deleteImages = (images) => {
  return Promise
    .all(images.map(image => deleteOneImage(image)))
    .then(createdImages => createdImages)
    .catch((error) => {
      throw new CustomError(error?.status ?? 500, error?.message ?? error)
    })
}

export default {
  getAllImages,
  getOneImage,
  createOneImage,
  createImages,
  updateOneImage,
  updateImages,
  deleteOneImage,
  deleteImages
}
