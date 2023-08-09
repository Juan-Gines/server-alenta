import express from 'express'
import { getAllUsers, getOneUser, deleteOneUser, updatePersonalDataUser } from '#Controllers/userController.js'
import userUpdatePersonalDataDTO from '#DTO/user/updatePersonalData.js'
import userExtractor from '#Auth/userExtractor.js'
import trimBody from '#DTO/trimBody.js'
import avatarUser from '#Middleware/user/avatarUser.js'

const router = express.Router()

/*
  * Users Routes */
router

  .get('/', userExtractor, getAllUsers)

  .get('/profile', userExtractor, getOneUser)

  .patch('/personaldata', trimBody, userExtractor, userUpdatePersonalDataDTO, avatarUser, updatePersonalDataUser)

  .delete('/', userExtractor, deleteOneUser)

export default router
