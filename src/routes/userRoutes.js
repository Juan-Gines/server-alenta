import express from 'express'
import { getAllUsersController, getOneUserController, updatePersonalDataUserController, deleteOneUserController } from '#Controllers/userController.js'
import userUpdatePersonalDataDTO from '#DTO/user/updatePersonalData.js'
import userExtractor from '#Auth/userExtractor.js'
import trimBody from '#DTO/trimBody.js'

const router = express.Router()

/*
  * Users Routes */
router

  .use(userExtractor)

  .get('/', getAllUsersController)

  .get('/profile', getOneUserController)

  .patch('/personaldata', trimBody, userUpdatePersonalDataDTO, updatePersonalDataUserController)

  .delete('/', deleteOneUserController)

export default router
