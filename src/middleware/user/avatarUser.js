import imageService from '#Services/imageService.js'

const avatarUser = async (req, res, next) => {
  const { userId } = req
  const { avatar } = req.body

  if (avatar) {
    req.body.avatar = await createAndGetIdFromPoster(userId, avatar, next)
  }
  next()
}

const createAndGetIdFromPoster = (userId, avatar, next) => {
  return imageService.createOneImage(userId, avatar)
    .then(p => p._id)
    .catch((error) => {
      next(error)
    })
}

export default avatarUser
