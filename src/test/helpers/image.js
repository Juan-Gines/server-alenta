// Datos para insertar una imagen

import { getOneImage } from '#Services/imageService.js'

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
  const image = await getOneImage(imageId)
  return image
}

export {
  newImage,
  arrayImages,
  getImage

}
