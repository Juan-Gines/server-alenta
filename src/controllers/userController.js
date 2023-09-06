import { deleteOneUser, getAllUsers, updateOneUser } from '#Services/userService.js'

// * Controller return all users

const getAllUsersController = (req, res, next) => {
  getAllUsers()
    .then((data) => res.json({ status: 'OK', data }))
    .catch(error => {
      next(error)
    })
}

// * Controller return one user

const getOneUserController = (req, res) => {
  const { user } = req
  res.json({ status: 'OK', data: user })
}

// * Controller update personal data user

const updatePersonalDataUserController = (req, res, next) => {
  const { body, user } = req
  updateOneUser(user, body)
    .then((updatedUser) => res.json({ status: 'OK', data: updatedUser }))
    .catch((error) => {
      next(error)
    })
}

// * Delete user

const deleteOneUserController = (req, res, next) => {
  deleteOneUser(req.user)
    .then((deletedUser) => res.json({ status: 'OK', data: deletedUser }))
    .catch((error) => {
      next(error)
    })
}

export {
  getAllUsersController,
  getOneUserController,
  updatePersonalDataUserController,
  deleteOneUserController
}
