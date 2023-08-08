import express from 'express'
import userExtractor from '#Auth/userExtractor.js'
import trimBody from '#DTO/trimBody.js'
import { createImage, deleteImage, getAllImages, getOneImage, updateImage } from '#Controllers/imageController.js'

const router = express.Router()

/*
  * Users Routes */
router

  .get('/', getAllImages)

  .get('/:imageId', getOneImage)

  .post('/', trimBody, userExtractor, createImage)

  .patch('/', trimBody, userExtractor, updateImage)

  .delete('/:imageId', userExtractor, deleteImage)

export default router
