import express from 'express'
import userExtractor from '#Auth/userExtractor.js'
import trimBody from '#DTO/trimBody.js'
import { createPostController, deletePostController, getAllPostsController, getOnePostController, updatePostController } from '#Controllers/postController.js'
import createPostDTO from '#DTO/post/createPost.js'
import updatePostDTO from '#DTO/post/updatePost.js'
import updateMiddleware from '#Middleware/post/updatePost.js'
import createMiddleware from '#Middleware/post/createPost.js'

const router = express.Router()

/*
  * Users Routes */
router

  .get('/', getAllPostsController)

  .get('/:postId', getOnePostController)

  .post('/', trimBody, userExtractor, createPostDTO, createMiddleware, createPostController)

  .patch('/', trimBody, userExtractor, updatePostDTO, updateMiddleware, updatePostController)

  .delete('/:postId', userExtractor, deletePostController)

export default router
