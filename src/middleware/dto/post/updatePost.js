import { Type } from '@sinclair/typebox'
import Ajv from 'ajv'
import addErrors from 'ajv-errors'
import { bodyDTOSchema, extractDTOSchema, imagesDTOSquema, posterDTOSquema, titleDTOSchema } from './typesPost.js'
import { CustomError } from '#Errors/CustomError.js'
import { errorMessageES } from '#Lang/es/errorMessage.js'
import { idDTOSchema } from '#DTO/typesGeneral.js'

// ! Error messages

const { errRequired } = errorMessageES

// * Validation user personal data

const UpdateDataDTOSchema = Type.Object(
  {
    title: titleDTOSchema,
    body: bodyDTOSchema,
    extract: extractDTOSchema,
    poster: posterDTOSquema,
    images: imagesDTOSquema,
    id: idDTOSchema
  },
  {
    errorMessage: {
      required: {
        title: errRequired('título'),
        body: errRequired('cuerpo'),
        extract: errRequired('extracto'),
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
