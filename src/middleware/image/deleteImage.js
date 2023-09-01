import { CustomError } from '#Errors/CustomError.js'
import { errorMessageES } from '#Lang/es/errorMessage.js'
import imageService from '#Services/imageService.js'
import postService from '#Services/postService.js'

// ! Mensajes de error

const { errEmptyImage, errUnAuthorized } = errorMessageES

const deleteImageMiddleware = async (req, res, next) => {
  const { imageId } = req.params
  const { user } = req
  try {
    const image = await imageService.getOneImage(imageId)
    if (!image) {
      throw new CustomError(404, errEmptyImage)
    }
    if (!image.user.equals(user._id)) {
      throw new CustomError(401, errUnAuthorized)
    }
    if (image.post) {
      const post = await postService.getOnePost(image.post, user)
      const postForUpdate = post.depopulate()
      if (image._id.equals(postForUpdate.poster)) {
        postForUpdate.set('poster')
      } else {
        postForUpdate.images = postForUpdate.images.filter(i => i.equals(image._id))
      }
      await postForUpdate.save()
    } else {
      user.set('avatar')
      await user.save()
    }
    next()
  } catch (error) {
    next(error)
  }
}

export default deleteImageMiddleware
