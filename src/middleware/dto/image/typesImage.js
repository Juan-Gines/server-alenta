import { numberDTOSchema, stringDTOSchema } from '#DTO/typesGeneral.js'
import { errorMessageES } from '#Lang/es/errorMessage.js'
import { Type } from '@sinclair/typebox'

//! Error messages

const { errTypeBoolean } = errorMessageES

// ? VALIDACIONES PARA IMAGE MODEL

export const imageNameDTOSchema = stringDTOSchema(4, 50)
export const pathDTOSquema = stringDTOSchema(4, 50)
export const bytesDTOSquema = numberDTOSchema(10, 2048)
export const avatarBoolDTOSchema = Type.Boolean({
  errorMessage: {
    type: errTypeBoolean
  }
})
