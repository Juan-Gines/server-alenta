import { Type } from '@sinclair/typebox'
import { errorMessageES } from '#Lang/es/errorMessage.js'
import { stringDTOSchema } from '#DTO/typesGeneral.js'
import { avatarBoolDTOSchema, bytesDTOSquema, imageNameDTOSchema, pathDTOSquema } from '#DTO/image/typesImage.js'

// ! Error messages

const { errTypeString, errMinLength, errMaxLength, errRoleEnum, errFormatEmail, errFormatPassword, errTypeObject, errFormatObject } = errorMessageES

// ? VALIDACIONES PARA USER MODEL

export const nameDTOSchema = stringDTOSchema(4, 25)

export const surnameDTOSchema = stringDTOSchema(4, 50)

export const avatarDTOSchema = Type.Optional(Type.Object({
  imageName: imageNameDTOSchema,
  path: pathDTOSquema,
  bytes: bytesDTOSquema,
  avatar: avatarBoolDTOSchema
}, {
  additionalProperties: false,
  errorMessage: {
    additionalProperties: errFormatObject,
    type: errTypeObject
  }
}
))

export const roleDTOSchema = Type.String({
  enum: ['user', 'family', 'admin', 'friend'],
  errorMessage: {
    type: errTypeString,
    enum: errRoleEnum
  }
})

export const emailDTOSchema = Type.String({
  format: 'email',
  errorMessage: {
    type: errTypeString,
    format: errFormatEmail
  }
})

export const passwordDTOSchema = Type.String({
  format: 'password',
  minLength: 8,
  maxLength: 20,
  errorMessage: {
    type: errTypeString,
    format: errFormatPassword,
    minLength: errMinLength(8),
    maxLength: errMaxLength(20)
  }
})
