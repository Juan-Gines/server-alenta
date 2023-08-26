import express from 'express'
import { getAllUsers, getOneUser, deleteOneUser, updatePersonalDataUser } from '#Controllers/userController.js'
import userUpdatePersonalDataDTO from '#DTO/user/updatePersonalData.js'
import userExtractor from '#Auth/userExtractor.js'
import trimBody from '#DTO/trimBody.js'

const router = express.Router()

/*
  * Users Routes */
router

  .use(userExtractor)

  .get('/', getAllUsers)

  .get('/profile', getOneUser)

  .patch('/personaldata', trimBody, userUpdatePersonalDataDTO, updatePersonalDataUser)

  .delete('/', deleteOneUser)

export default router
