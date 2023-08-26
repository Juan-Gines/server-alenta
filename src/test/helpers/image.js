// Datos para insertar una imagen

import ImageModel from '#Models/image.js'

const newImage = {
  imageName: 'imagen.jpg',
  path: '/src/images',
  bytes: 458
}

const arrayImages = (count) => {
  const images = []
  for (let index = 0; index < count; index++) {
    images.push(newImage)
  }
  return images
}

const getImage = async (imageId) => {
  const image = await ImageModel.findById(imageId)
  return image
}

// const getImages = async (images) => {
//   return Promise
//     .all(images.map(image => imageService.getOneImage(image)))
//     .then(newImages => newImages)
// }

export {
  newImage,
  arrayImages,
  getImage

}
