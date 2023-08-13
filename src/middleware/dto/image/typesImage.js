import { booleanDTOSchema, numberDTOSchema, stringDTOSchema } from '#DTO/typesGeneral.js'
import { errorMessageES } from '#Lang/es/errorMessage.js'
import { Type } from '@sinclair/typebox'

//! Error messages

const { errTypeObject, errRequired } = errorMessageES

// ? VALIDACIONES PARA IMAGE MODEL

export const imageDTOSchema = Type.Object({
  imageName: stringDTOSchema(4, 50),
  path: stringDTOSchema(4, 50),
  bytes: numberDTOSchema(10, 2048),
  avatar: Type.Optional(booleanDTOSchema)
}, {
  errorMessage: {
    type: errTypeObject,
    required: {
      imageName: errRequired('imageName'),
      path: errRequired('path'),
      bytes: errRequired('bytes')
    }
  }
})
