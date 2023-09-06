import { deleteOneImage, getAllImages, getOneImage } from '#Services/imageService.js'

// * Controller return all images

const getAllImagesController = (req, res, next) => {
  getAllImages()
    .then((data) => res.json({ status: 'OK', data }))
    .catch(error => {
      next(error)
    })
}

// * Controller return one image

const getOneImageController = (req, res, next) => {
  const { imageId } = req.params
  getOneImage(imageId)
    .then((data) => res.json({ status: 'OK', data }))
    .catch((error) => {
      next(error)
    })
}

// * Delete Image
const deleteImageController = (req, res, next) => {
  const { imageId } = req.params
  deleteOneImage(imageId)
    .then((data) => res.json({ status: 'OK', data }))
    .catch((error) => {
      next(error)
    })
}

export {
  getAllImagesController,
  getOneImageController,
  deleteImageController
}
