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

const getOneUser = (req, res) => {
  const { user } = req
  res.json({ status: 'OK', data: user })
}

// * Controller update personal data user

const updatePersonalDataUser = (req, res, next) => {
  const { body, user } = req
  userService
    .updateOneUser(user, body)
    .then((updatedUser) => res.json({ status: 'OK', data: updatedUser }))
    .catch((error) => {
      next(error)
    })
}

// * Delete user

const deleteOneUser = (req, res, next) => {
  userService
    .deleteOneUser(req.user)
    .then((deletedUser) => res.json({ status: 'OK', data: deletedUser }))
    .catch((error) => {
      next(error)
    })
}

export {
  getAllUsers,
  getOneUser,
  updatePersonalDataUser,
  deleteOneUser
}
