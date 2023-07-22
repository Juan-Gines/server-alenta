import userService from '#Services/userService.js'

const registerController = (req, res, next) => {
  const { body } = req

  userService
    .createNewUser(body)
    .then((createdUser) =>
      res.status(201).json({ status: 'OK', data: createdUser })
    )
    .catch((error) => {
      next(error)
    })
}

export default registerController
