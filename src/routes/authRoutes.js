import express from 'express'
import userLoginDTO from '#Auth/login.js'
import userRegisterDTO from '#Auth/register.js'
import userUpdatePasswordDTO from '#Auth/updatePassword.js'
import userExtractor from '#Auth/userExtractor.js'
import { activeAcountController, forgotPasswordController, registerController, resetPasswordController, updatePasswordController, userLoginController } from '#Controllers/authController.js'
import trimBody from '#DTO/trimBody.js'
import forgotPasswordDTO from '#Auth/forgotPassword.js'
import resetPasswordDTO from '#Auth/resetPassword.js'

const router = express.Router()

// *** Auth routes ***
// TODO: crear la nueva ruta que cambia el password recibiendo el token
router

  .post('/login', trimBody, userLoginDTO, userLoginController)

  .post('/register', trimBody, userRegisterDTO, registerController)

  .post('/forgot-password', trimBody, forgotPasswordDTO, forgotPasswordController)

  .post('/reset-password', trimBody, userExtractor, resetPasswordDTO, resetPasswordController)

  .get('/active-acount', userExtractor, activeAcountController)

  .patch('/password', trimBody, userExtractor, userUpdatePasswordDTO, updatePasswordController)

export default router
