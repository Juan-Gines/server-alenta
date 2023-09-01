import imageService from '#Services/imageService.js'

// * Controller return all images

const getAllImages = (req, res, next) => {
  imageService
    .getAllImages()
    .then((data) => res.json({ status: 'OK', data }))
    .catch(error => {
      next(error)
    })
}

// * Controller return one image

const getOneImage = (req, res, next) => {
  const { imageId } = req.params
  imageService
    .getOneImage(imageId)
    .then((data) => res.json({ status: 'OK', data }))
    .catch((error) => {
      next(error)
    })
}

// * Delete Image
const deleteImage = (req, res, next) => {
  const { imageId } = req.params
  imageService
    .deleteOneImage(imageId)
    .then((data) => res.json({ status: 'OK', data }))
    .catch((error) => {
      next(error)
    })
}

export {
  getAllImages,
  getOneImage,
  deleteImage
}
