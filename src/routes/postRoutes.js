import express from 'express'
import userExtractor from '#Auth/userExtractor.js'
import trimBody from '#DTO/trimBody.js'
import { createPost, deletePost, getAllPosts, getOnePost, updatePost } from '#Controllers/postController.js'

const router = express.Router()

/*
  * Users Routes */
router

  .get('/', getAllPosts)

  .get('/:postId', getOnePost)

  .post('/', trimBody, userExtractor, createPost)

  .patch('/', trimBody, userExtractor, updatePost)

  .delete('/', userExtractor, deletePost)

export default router
