import { Type } from '@sinclair/typebox'
import Ajv from 'ajv'
import addErrors from 'ajv-errors'
import { passwordDTOSchema } from '../dto/user/types.js'
import { CustomError } from '#Errors/CustomError.js'
import { errorMessageES } from '#Lang/es/errorMessage.js'

// ! Error messages

const { errFormatObject, errRequired } = errorMessageES.user

// * Validation user change password

const UpdateDataDTOSchema = Type.Object(
  {
    oldPassword: passwordDTOSchema,
    newPassword: passwordDTOSchema
  },
  {
    additionalProperties: false,
    errorMessage: {
      additionalProperties: errFormatObject,
      required: {
        oldPassword: errRequired('antiguo password'),
        newPassword: errRequired('nuevo password')
      }
    }
  }
)

const ajv = new Ajv({ allErrors: true })
  .addKeyword('kind')
  .addKeyword('modifier')
ajv.addFormat('password', /^(?=.+\d)(?=.*[a-z])(?=.*[A-Z]).*$/)
addErrors(ajv)

const validateSchema = ajv.compile(UpdateDataDTOSchema)

const userUpdatePasswordDTO = (req, res, next) => {
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

export default userUpdatePasswordDTO
