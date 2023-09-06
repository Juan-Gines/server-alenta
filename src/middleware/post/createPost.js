import { createImages, createOneImage } from '#Services/imageService.js'

const createMiddleware = async (req, res, next) => {
  const { user } = req
  const { images, poster } = req.body
  try {
    if (images) {
      const createdImages = await createImages(user._id, images)
      const ids = createdImages.map(i => i._id)
      images.splice(0, createdImages.length, ...ids)
    }
    if (poster) {
      req.body.poster = (await createOneImage(user._id, poster))._id
    }
    next()
  } catch (error) {
    next(error)
  }
}

export default createMiddleware
