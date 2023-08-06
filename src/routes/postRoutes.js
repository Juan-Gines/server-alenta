import express from 'express'
import userExtractor from '#Auth/userExtractor.js'
import trimBody from '#DTO/trimBody.js'
import { createPost, deletePost, getAllPosts, getOnePost, updatePost } from '#Controllers/postController.js'
import createPostDTO from '#DTO/posts/createPost.js'
import updatePostDTO from '#DTO/posts/updatePost.js'

const router = express.Router()

/*
  * Users Routes */
router

  .get('/', getAllPosts)

  .get('/:postId', getOnePost)

  .post('/', trimBody, userExtractor, createPostDTO, createPost)

  .patch('/', trimBody, userExtractor, updatePostDTO, updatePost)

  .delete('/:postId', userExtractor, deletePost)

export default router
