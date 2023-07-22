import { Type } from '@sinclair/typebox'
import Ajv from 'ajv'
import addErrors from 'ajv-errors'
import { nameDTOSchema, surnameDTOSchema } from './types.js'
import { CustomError } from '#Errors/CustomError.js'
import { errorMessageES } from '#Lang/es/errorMessage.js'

const { errFormatObject, errRequired } = errorMessageES.user

const UpdateDataDTOSchema = Type.Object(
  {
    name: nameDTOSchema,
    surname: surnameDTOSchema
  },
  {
    additionalProperties: false,
    errorMessage: {
      additionalProperties: errFormatObject,
      required: {
        name: errRequired('nombre'),
        surname: errRequired('apellidos')
      }
    }
  }
)

const ajv = new Ajv({ allErrors: true })
  .addKeyword('kind')
  .addKeyword('modifier')
addErrors(ajv)

const validateSchema = ajv.compile(UpdateDataDTOSchema)

const userUpdateDataDTO = (req, res, next) => {
  const isDTOValid = validateSchema(req.body)

  if (!isDTOValid) {
    throw new CustomError(400,
      validateSchema.errors.map((path) => {
        return {
          property:
              path.instancePath.length === 0
                ? path.params.errors[0].params.missingProperty
                : path.instancePath.substring(1),
          message: path.message
        }
      })
    )
  }

  next()
}

export default userUpdateDataDTO
