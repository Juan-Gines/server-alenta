import { Type } from '@sinclair/typebox'
import Ajv from 'ajv'
import addErrors from 'ajv-errors'
import { imageDTOSchema } from './types.js'
import { CustomError } from '#Errors/CustomError.js'
import { errorMessageES } from '#Lang/es/errorMessage.js'

// ! Error messages

const { errFormatObject, errRequired } = errorMessageES.user

// * Validation user image data

const UpdateDataDTOSchema = Type.Object(
  {
    image: imageDTOSchema
  },
  {
    additionalProperties: false,
    errorMessage: {
      additionalProperties: errFormatObject,
      required: {
        image: errRequired('imagen')
      }
    }
  }
)

const ajv = new Ajv({ allErrors: true })
  .addKeyword('kind')
  .addKeyword('modifier')
addErrors(ajv)

const validateSchema = ajv.compile(UpdateDataDTOSchema)

const userUpdateImageDTO = (req, res, next) => {
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

export default userUpdateImageDTO
