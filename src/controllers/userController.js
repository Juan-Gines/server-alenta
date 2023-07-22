import userService from '#Services/userService.js'

const getAllUsers = (req, res, next) => {
  userService
    .getAllUsers()
    .then((data) => res.json({ status: 'OK', data }))
    .catch(error => {
      next(error)
    })
}

const getOneUser = async (req, res, next) => {
  userService
    .getOneUser(req.id)
    .then((data) => res.json({ status: 'OK', data }))
    .catch((error) => {
      next(error)
    })
}

const updateOneUser = (req, res, next) => {
  const { body, id } = req
  userService
    .updateOneUser(id, body)
    .then((updatedUser) => res.json({ status: 'OK', data: updatedUser }))
    .catch((error) => {
      next(error)
    })
}

const deleteOneUser = (req, res, next) => {
  userService
    .deleteOneUser(req.id)
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
  updateOneUser,
  deleteOneUser
}
