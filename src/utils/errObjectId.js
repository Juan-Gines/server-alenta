import { errorMessageES } from '#Lang/es/errorMessage.js'

const errObjectId = (error) => {
  if (error.kind === 'ObjectId') {
    error.status = 404
    error.message = errorMessageES.errEmptyPost
  }
  return error
}

export default errObjectId
