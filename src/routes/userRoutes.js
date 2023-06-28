import express from 'express';
import { getAllUsers, getOneUser, createNewUser, updateOneUser, deleteOneUser } from '#Controllers/userController.js';


const router = express.Router();

/* 
  * Users Routes */ 
router

  .get('/', getAllUsers)

  .get('/:userId', getOneUser)

  .post('/', createNewUser)

  .patch('/:userId', updateOneUser)

  .delete('/:userId', deleteOneUser)

export default router;