import express from 'express'
import { getAllUsers, getOneUser, deleteOneUser, updatePersonalDataUser, updateImageUser } from '#Controllers/userController.js'
import userUpdatePersonalDataDTO from '#DTO/user/updatePersonalData.js'
import userExtractor from '#Auth/userExtractor.js'
import userUpdateImageDTO from '#DTO/user/updateAvatar.js'
import trimBody from '#DTO/trimBody.js'

const router = express.Router()

/*
  * Users Routes */
router

  .get('/', userExtractor, getAllUsers)

  .get('/profile', userExtractor, getOneUser)

  .patch('/personaldata', trimBody, userExtractor, userUpdatePersonalDataDTO, updatePersonalDataUser)

  .patch('/image', trimBody, userExtractor, userUpdateImageDTO, updateImageUser)

  .delete('/', userExtractor, deleteOneUser)

export default router
