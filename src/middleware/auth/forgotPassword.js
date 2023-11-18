import { Type } from '@sinclair/typebox'
import Ajv from 'ajv'
import addErrors from 'ajv-errors'
import addFormats from 'ajv-formats'
import { emailDTOSchema } from '../dto/user/typesUser.js'
import { CustomError } from '#Errors/CustomError.js'
import { errorMessageES } from '#Lang/es/errorMessage.js'

// ! Error messages

const { errRequired } = errorMessageES

// * Validation user change password

const ForgotPasswordDTOSchema = Type.Object(
  {
    email: emailDTOSchema
  },
  {
    errorMessage: {
      required: {
        email: errRequired('email')
      }
    }
  }
)

const ajv = new Ajv({ allErrors: true })
  .addKeyword('kind')
  .addKeyword('modifier')
addFormats(ajv, ['email'])
addErrors(ajv)

const validateSchema = ajv.compile(ForgotPasswordDTOSchema)

const forgotPasswordDTO = (req, res, next) => {
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

export default forgotPasswordDTO
