import { errorMessageES } from '#Lang/es/errorMessage.js'
import { Type } from '@sinclair/typebox'

// ! Errores

const { errTypeString, errIdErroneo, errMinLength, errMaxLength, errMaximum, errMinimum, errTypeNumber, errTypeBoolean } = errorMessageES

// ? Tipos de validación generales

export const idDTOSchema = Type.String({
  minLength: 24,
  maxLength: 24,
  errorMessage: {
    type: errTypeString,
    minLength: errIdErroneo,
    maxLength: errIdErroneo
  }
})

export const stringDTOSchema = (min, max) => {
  return Type.String({
    minLength: min,
    maxLength: max,
    errorMessage: {
      type: errTypeString,
      minLength: errMinLength(min),
      maxLength: errMaxLength(max)
    }
  })
}

export const numberDTOSchema = (min, max) => {
  return Type.Number({
    maximum: max,
    minimum: min,
    errorMessage: {
      type: errTypeNumber,
      maximum: errMaximum(max),
      minimum: errMinimum(min)
    }
  })
}

export const booleanDTOSchema = () => {
  return Type.Boolean({
    errorMessage: {
      type: errTypeBoolean
    }
  })
}
