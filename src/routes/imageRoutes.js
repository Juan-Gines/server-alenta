import express from 'express'
import userExtractor from '#Auth/userExtractor.js'
import { deleteImage, getAllImages, getOneImage } from '#Controllers/imageController.js'
import deleteImageMiddleware from '#Middleware/image/deleteImage.js'

const router = express.Router()

/*
  * Users Routes */
router

  .get('/', getAllImages)

  .get('/:imageId', getOneImage)

  .delete('/:imageId', userExtractor, deleteImageMiddleware, deleteImage)

export default router
