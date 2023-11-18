import { CustomError } from '#Errors/CustomError.js'
import { errorMessageES } from '#Lang/es/errorMessage.js'
import { forgotPassword, loginUser, registerNewUser, resetPassword, updatePasswordUser } from '#Services/authService.js'

// * Login controlador

const userLoginController = (req, res, next) => {
  const { email, password } = req.body
  loginUser(email.toLowerCase(), password)
    .then(log => res.json({ status: 'OK', data: log }))
    .catch((error) => {
      next(error)
    })
}

// * Registro controlador

const registerController = (req, res, next) => {
  const { body } = req
  registerNewUser(body)
    .then((createdUser) => res.status(201).json({ status: 'OK', data: createdUser })
    )
    .catch((error) => {
      next(error)
    })
}

// * Updatear contraseña controlador

const updatePasswordController = (req, res, next) => {
  const { body, user } = req
  const { oldPassword, newPassword } = body
  if (oldPassword === newPassword) {
    const error = new CustomError(400, errorMessageES.errNewPassEqualToOld)
    next(error)
  }
  updatePasswordUser(user, body)
    .then((passUpdated) => res.json({ status: 'OK', data: passUpdated }))
    .catch((error) => {
      next(error)
    })
}

// * Contraseña olvidada controlador

const forgotPasswordController = (req, res, next) => {
  const { email } = req.body

  forgotPassword(email)
    .then((mailEnviado) => res.json({ status: 'OK', data: mailEnviado }))
    .catch((error) => {
      next(error)
    })
}

// * Reseteamos la contraseña olvidada

const resetPasswordController = (req, res, next) => {
  const { body, user } = req
  const { newPassword } = body
  resetPassword(user, newPassword)
    .then((mailEnviado) => res.json({ status: 'OK', data: mailEnviado }))
    .catch((error) => {
      next(error)
    })
}

export {
  registerController,
  userLoginController,
  updatePasswordController,
  forgotPasswordController,
  resetPasswordController
}
