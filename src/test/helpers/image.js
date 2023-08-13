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

export {
  newImage,
  arrayImages,
  getImage
}
