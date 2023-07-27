import { Type } from '@sinclair/typebox'
import { errorMessageES } from '#Lang/es/errorMessage.js'

// ! Error messages

const { errTypeString, errMinLength, errMaxLength, errRoleEnum, errFormatEmail, errFormatPassword } = errorMessageES.user

// ? Error types validation

export const nameDTOSchema = Type.String({
  minLength: 4,
  maxLength: 25,
  errorMessage: {
    type: errTypeString,
    minLength: errMinLength(4),
    maxLength: errMaxLength(25)
  }
})

export const surnameDTOSchema = Type.String({
  minLength: 4,
  maxLength: 50,
  errorMessage: {
    type: errTypeString,
    minLength: errMinLength(4),
    maxLength: errMaxLength(50)
  }
})

export const imageDTOSchema = Type.String({
  minLength: 4,
  errorMessage: {
    type: errTypeString,
    minLength: errMinLength(4)
  }
})

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
