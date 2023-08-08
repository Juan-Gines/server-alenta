import { Type } from '@sinclair/typebox'
import { errorMessageES } from '#Lang/es/errorMessage.js'
import { numberDTOSchema, stringDTOSchema } from '#DTO/typesGeneral.js'
import { bytesDTOSquema, imageNameDTOSchema, pathDTOSquema } from '#DTO/image/typesImage.js'

// ! Error messages

const { errTypeObject, errTypeArray, errMaxImages } = errorMessageES

// ? Error types validation

export const titleDTOSchema = stringDTOSchema(4, 50)

export const extractDTOSchema = stringDTOSchema(4, 100)

export const bodyDTOSchema = stringDTOSchema(4, 1000)

export const imagesDTOSquema = Type.Optional(Type.Array(
  Type.Object({
    imageName: imageNameDTOSchema,
    path: pathDTOSquema,
    bytes: bytesDTOSquema
  },
  {
    errorMessage: {
      type: errTypeObject
    }
  }),
  {
    maxItems: 10,
    errorMessage: {
      type: errTypeArray,
      maxItems: errMaxImages
    }
  }
))

export const posterDTOSquema = Type.Optional(Type.Object({
  imageName: stringDTOSchema(4, 50),
  path: stringDTOSchema(4, 50),
  bytes: numberDTOSchema(10, 2048)
},
{
  errorMessage: {
    type: errTypeObject
  }
}))
