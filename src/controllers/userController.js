import userService from '#Services/userService.js'

// * Controller return all users

const getAllUsers = (req, res, next) => {
  userService
    .getAllUsers()
    .then((data) => res.json({ status: 'OK', data }))
    .catch(error => {
      next(error)
    })
}

// * Controller return one user

const getOneUser = async (req, res, next) => {
  userService
    .getOneUser(req.userId)
    .then((data) => res.json({ status: 'OK', data }))
    .catch((error) => {
      next(error)
    })
}

// * Controller update personal data user

const updatePersonalDataUser = (req, res, next) => {
  const { body, userId } = req
  userService
    .updateOneUser(userId, body)
    .then((updatedUser) => res.json({ status: 'OK', data: updatedUser }))
    .catch((error) => {
      next(error)
    })
}

// * Controller update image user

const updateImageUser = (req, res, next) => {
  const { body, userId } = req
  userService
    .updateOneUser(userId, body)
    .then((updatedUser) => res.json({ status: 'OK', data: updatedUser }))
    .catch((error) => {
      next(error)
    })
}

// * Delete user

const deleteOneUser = (req, res, next) => {
  userService
    .deleteOneUser(req.userId)
    .then((deletedUser) => {
      res.json({ status: 'OK', data: deletedUser })
    })
    .catch((error) => {
      next(error)
    })
}

export {
  getAllUsers,
  getOneUser,
  updatePersonalDataUser,
  updateImageUser,
  deleteOneUser
}
