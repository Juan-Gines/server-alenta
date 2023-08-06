import { Type } from '@sinclair/typebox'
import { errorMessageES } from '#Lang/es/errorMessage.js'

// ! Error messages

const { errTypeString, errMinLength, errMaxLength, errIdErroneo } = errorMessageES

// ? Error types validation

export const titleDTOSchema = Type.String({
  minLength: 4,
  maxLength: 50,
  errorMessage: {
    type: errTypeString,
    minLength: errMinLength(4),
    maxLength: errMaxLength(50)
  }
})

export const bodyDTOSchema = Type.String({
  minLength: 4,
  maxLength: 1000,
  errorMessage: {
    type: errTypeString,
    minLength: errMinLength(4),
    maxLength: errMaxLength(1000)
  }
})

export const idDTOSchema = Type.String({
  minLength: 24,
  maxLength: 24,
  errorMessage: {
    type: errTypeString,
    minLength: errIdErroneo,
    maxLength: errIdErroneo
  }
})
