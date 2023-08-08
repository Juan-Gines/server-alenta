import imageService from '#Services/imageService.js'

const imagesPost = async (req, res, next) => {
  const { userId } = req
  const { images, poster } = req.body

  if (images) {
    const imagesIds = await createAndGetIdFromImages(userId, images, next)
    images.splice(0, imagesIds.length, ...imagesIds)
  }
  if (poster) {
    req.body.poster = await createAndGetIdFromPoster(userId, poster, next)
  }
  next()
}
const createAndGetIdFromImages = (userId, images, next) => {
  return Promise
    .all(images.map(image => imageService.createOneImage(userId, image)))
    .then(createdImages => {
      const imagesIds = createdImages.map(i => i._id)
      return imagesIds
    })
    .catch((error) => {
      next(error)
    })
}

const createAndGetIdFromPoster = (userId, poster, next) => {
  return imageService.createOneImage(userId, poster)
    .then(p => p._id)
    .catch((error) => {
      next(error)
    })
}

export default imagesPost
