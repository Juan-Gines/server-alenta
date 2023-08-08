import imageService from '#Services/imageService.js'

// * Controller return all images

const getAllImages = (req, res, next) => {
  imageService
    .getAllImages()
    .then((data) => res.json({ status: 'OK', data }))
    .catch(error => {
      next(error)
    })
}

// * Controller return one image

const getOneImage = (req, res, next) => {
  const { postId } = req.params
  imageService
    .getOneImage(postId)
    .then((data) => res.json({ status: 'OK', data }))
    .catch((error) => {
      next(error)
    })
}
// * Create Image

const createImage = (req, res, next) => {
  const { body, userId } = req
  imageService
    .createOneImage(userId, body)
    .then((data) => res.status(201).json({ status: 'OK', data }))
    .catch((error) => {
      next(error)
    })
}

// * Controller update personal data user

const updateImage = (req, res, next) => {
  const { body, userId } = req
  imageService
    .updateOneImage(userId, body)
    .then((data) => res.json({ status: 'OK', data }))
    .catch((error) => {
      next(error)
    })
}

// * Delete user

const deleteImage = (req, res, next) => {
  const { userId } = req
  const { imageId } = req.params
  imageService
    .deleteOneImage(userId, imageId)
    .then((data) => res.json({ status: 'OK', data }))
    .catch((error) => {
      next(error)
    })
}

export {
  getAllImages,
  getOneImage,
  createImage,
  updateImage,
  deleteImage
}
