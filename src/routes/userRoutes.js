import express from 'express'
import { getAllUsers, getOneUser, updateOneUser, deleteOneUser } from '#Controllers/userController.js'
import userUpdateDataDTO from '#DTO/user/updateUser.js'
import userExtractor from '#Auth/userExtractor.js'

const router = express.Router()

/*
  * Users Routes */
router

  .get('/', getAllUsers)

  .get('/perfil', userExtractor, getOneUser)

  .patch('/', userExtractor, userUpdateDataDTO, updateOneUser)

  .delete('/', userExtractor, deleteOneUser)

export default router
