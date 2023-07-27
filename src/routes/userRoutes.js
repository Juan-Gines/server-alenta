import express from 'express'
import { getAllUsers, getOneUser, deleteOneUser, updatePersonalDataUser, updateImageUser } from '#Controllers/userController.js'
import userUpdatePersonalDataDTO from '#DTO/user/updatePersonalData.js'
import userExtractor from '#Auth/userExtractor.js'
import userUpdateImageDTO from '#DTO/user/updateImage.js'

const router = express.Router()

/*
  * Users Routes */
router

  .get('/', userExtractor, getAllUsers)

  .get('/profile', userExtractor, getOneUser)

  .patch('/personaldata', userExtractor, userUpdatePersonalDataDTO, updatePersonalDataUser)

  .patch('/image', userExtractor, userUpdateImageDTO, updateImageUser)

  .delete('/', userExtractor, deleteOneUser)

export default router
