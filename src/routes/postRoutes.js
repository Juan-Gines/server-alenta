import express from 'express'
import userExtractor from '#Auth/userExtractor.js'
import trimBody from '#DTO/trimBody.js'
import { createPost, deletePost, getAllPosts, getOnePost, updatePost } from '#Controllers/postController.js'
import createPostDTO from '#DTO/post/createPost.js'
import updatePostDTO from '#DTO/post/updatePost.js'
import imagesPost from '#Middleware/post/imagesPost.js'

const router = express.Router()

/*
  * Users Routes */
router

  .get('/', getAllPosts)

  .get('/:postId', getOnePost)

  .post('/', trimBody, userExtractor, createPostDTO, imagesPost, createPost)

  .patch('/', trimBody, userExtractor, updatePostDTO, imagesPost, updatePost)

  .delete('/:postId', userExtractor, deletePost)

export default router
