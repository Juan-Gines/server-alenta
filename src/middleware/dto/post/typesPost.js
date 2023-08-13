import { Type } from '@sinclair/typebox'
import { errorMessageES } from '#Lang/es/errorMessage.js'
import { stringDTOSchema } from '#DTO/typesGeneral.js'
import { imageDTOSchema } from '#DTO/image/typesImage.js'

// ! Error messages

const { errTypeArray, errMaxImages } = errorMessageES

// ? VALIDACIONES PARA POST MODEL

export const titleDTOSchema = stringDTOSchema(4, 50)

export const extractDTOSchema = stringDTOSchema(4, 100)

export const bodyDTOSchema = stringDTOSchema(4, 1000)

export const imagesDTOSquema = Type.Optional(Type.Array(
  imageDTOSchema,
  {
    maxItems: 10,
    errorMessage: {
      type: errTypeArray,
      maxItems: errMaxImages
    }
  }
))

export const posterDTOSquema = Type.Optional(imageDTOSchema)
