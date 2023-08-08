import { Type } from '@sinclair/typebox'
import { errorMessageES } from '#Lang/es/errorMessage.js'
import { stringDTOSchema } from '#DTO/typesGeneral.js'

// ! Error messages

const { errTypeString, errMinLength, errMaxLength, errRoleEnum, errFormatEmail, errFormatPassword } = errorMessageES

// ? Error types validation

export const nameDTOSchema = stringDTOSchema(4, 25)

export const surnameDTOSchema = stringDTOSchema(4, 50)

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
