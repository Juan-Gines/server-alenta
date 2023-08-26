import { CustomError } from '#Errors/CustomError.js'
import { errorMessageES } from '#Lang/es/errorMessage.js'
import authService from '#Services/authService.js'

// * Login controller

const userLoginController = (req, res, next) => {
  const { email, password } = req.body
  authService
    .loginUser(email.toLowerCase(), password)
    .then(log => res.json({ status: 'OK', data: log }))
    .catch((error) => {
      next(error)
    })
}

// * Register controller

const registerController = (req, res, next) => {
  const { body } = req
  authService
    .registerNewUser(body)
    .then((createdUser) => res.status(201).json({ status: 'OK', data: createdUser })
    )
    .catch((error) => {
      next(error)
    })
}

// * Update password user controller

const updatePasswordController = (req, res, next) => {
  const { body, user } = req
  const { oldPassword, newPassword } = body
  if (oldPassword === newPassword) {
    const error = new CustomError(400, errorMessageES.errNewPassEqualToOld)
    next(error)
  }
  authService
    .updatePasswordUser(user, body)
    .then((passUpdated) => res.json({ status: 'OK', data: passUpdated }))
    .catch((error) => {
      next(error)
    })
}

export {
  registerController,
  userLoginController,
  updatePasswordController
}
