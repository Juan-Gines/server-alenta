import { Type } from '@sinclair/typebox'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import addErrors from 'ajv-errors'
import { emailDTOSchema, nameDTOSchema, passwordDTOSchema } from '#DTO/user/types.js'
import { CustomError } from '#Errors/CustomError.js'
import { errorMessageES } from '#Lang/es/errorMessage.js'

// ! error Messages

const { errFormatObject, errRequired } = errorMessageES.user

// * Register Validation data

const RegisterDTOSchema = Type.Object(
  {
    name: nameDTOSchema,
    email: emailDTOSchema,
    password: passwordDTOSchema
  },
  {
    additionalProperties: false,
    errorMessage: {
      additionalProperties: errFormatObject,
      required: {
        name: errRequired('nombre'),
        email: errRequired('email'),
        password: errRequired('password')
      }
    }
  }
)

const ajv = new Ajv({ allErrors: true })
  .addKeyword('Kind')
  .addKeyword('modifier')
ajv.addFormat('password', /^(?=.+\d)(?=.*[a-z])(?=.*[A-Z]).*$/)
addFormats(ajv, ['email', 'uuid'])
addErrors(ajv)

const validateSchema = ajv.compile(RegisterDTOSchema)

const userRegisterDTO = (req, res, next) => {
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

export default userRegisterDTO
