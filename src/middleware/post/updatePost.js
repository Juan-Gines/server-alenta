import { CustomError } from '#Errors/CustomError.js'
import { errorMessageES } from '#Lang/es/errorMessage.js'
import imageService from '#Services/imageService.js'
import postService from '#Services/postService.js'

const updateMiddleware = async (req, res, next) => {
  const { user } = req
  const { id, images, poster } = req.body
  try {
    // * Comprobamos si el post es del usuario

    const isPostFromUser = user.posts.find(p => p.equals(id))
    if (!isPostFromUser) {
      throw new CustomError(401, errorMessageES.errUnAuthorized)
    }
    const post = await postService.getOnePost(id)
    // * Comprobamos si existe el post

    if (!post) {
      user.posts = user.posts.filter(p => !p.equals(id))
      await user.save()
      throw new CustomError(404, errorMessageES.errEmptyPost)
    }

    // * Comprobamos si se van a updatear más de 10 imágenes

    if (images && post.images.length + images.length >= 10) {
      throw new CustomError(400, errorMessageES.errMaxImages)
    }

    // * Insertamos las imágenes en la DB

    if (images) {
      const imagesForCreate = images.map(image => {
        image.post = post._id
        return image
      })
      const createdImages = await imageService.createImages(user._id, imagesForCreate)
      const ids = createdImages.map(i => i._id)
      images.splice(0, createdImages.length, ...ids)
      if (!post.images.length === 0) {
        req.body.images = images.concat(post.images)
      }
    }

    if (poster) {
      if (post.poster) {
        poster.post = post._id
        req.body.poster = (await imageService.createOneImage(user._id, poster))._id
      } else {
        await imageService.updateOneImage(user._id, poster)
      }
    }
    next()
  } catch (error) {
    next(error)
  }
}

export default updateMiddleware
