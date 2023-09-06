import express from 'express'
import userExtractor from '#Auth/userExtractor.js'
import { deleteImageController, getAllImagesController, getOneImageController } from '#Controllers/imageController.js'
import deleteImageMiddleware from '#Middleware/image/deleteImage.js'

const router = express.Router()

/*
  * Users Routes */
router

  .get('/', getAllImagesController)

  .get('/:imageId', getOneImageController)

  .delete('/:imageId', userExtractor, deleteImageMiddleware, deleteImageController)

export default router
