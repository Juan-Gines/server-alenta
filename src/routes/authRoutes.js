import userLoginDTO from '#Auth/login.js'
import userRegisterDTO from '#Auth/register.js'
import userLoginController from '#Controllers/auth/login.js'
import registerController from '#Controllers/auth/register.js'
import express from 'express'

const router = express.Router()

// *** Auth routes ***

router

  .post('/login', userLoginDTO, userLoginController)

  .post('/register', userRegisterDTO, registerController)

export default router
