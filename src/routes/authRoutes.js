import express from 'express'
import userLoginDTO from '#Auth/login.js'
import userRegisterDTO from '#Auth/register.js'
import userUpdatePasswordDTO from '#Auth/updatePassword.js'
import userExtractor from '#Auth/userExtractor.js'
import { registerController, updatePasswordController, userLoginController } from '#Controllers/authController.js'

const router = express.Router()

// *** Auth routes ***

router

  .post('/login', userLoginDTO, userLoginController)

  .post('/register', userRegisterDTO, registerController)

  .patch('/password', userExtractor, userUpdatePasswordDTO, updatePasswordController)

export default router
