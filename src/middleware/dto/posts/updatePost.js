import { Type } from '@sinclair/typebox'
import Ajv from 'ajv'
import addErrors from 'ajv-errors'
import { bodyDTOSchema, idDTOSchema, titleDTOSchema } from './types.js'
import { CustomError } from '#Errors/CustomError.js'
import { errorMessageES } from '#Lang/es/errorMessage.js'

// ! Error messages

const { errFormatObject, errRequired } = errorMessageES

// * Validation user personal data

const UpdateDataDTOSchema = Type.Object(
  {
    title: titleDTOSchema,
    body: bodyDTOSchema,
    id: idDTOSchema
  },
  {
    additionalProperties: false,
    errorMessage: {
      additionalProperties: errFormatObject,
      required: {
        title: errRequired('título'),
        body: errRequired('cuerpo'),
        id: errRequired('id')
      }
    }
  }
)

const ajv = new Ajv({ allErrors: true })
  .addKeyword('kind')
  .addKeyword('modifier')
addErrors(ajv)

const validateSchema = ajv.compile(UpdateDataDTOSchema)

const updatePostDTO = (req, res, next) => {
  const isDTOValid = validateSchema(req.body)

  if (!isDTOValid) {
    throw new CustomError(400,
      validateSchema.errors.map((path) => {
        return {
          property:
              path.instancePath.length === 0
                ? path.params.errors[0].params.missingProperty
                : path.instancePath.substring(1),
          keyword: path.params.errors[0].keyword,
          message: path.message
        }
      })
    )
  }

  next()
}

export default updatePostDTO
