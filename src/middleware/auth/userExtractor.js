import { CustomError } from '#Errors/CustomError.js'
import { errorMessageES } from '#Lang/es/errorMessage.js'
import jwt from 'jsonwebtoken'

const { errUnAuthorized } = errorMessageES.user

const userExtractor = (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization) {
    throw new CustomError(401, errUnAuthorized)
  }

  const token = authorization.split(' ')[1]

  if (!token) {
    throw new CustomError(401, errUnAuthorized)
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
    req.id = decodedToken.id
    next()
  } catch (error) {
    throw new CustomError(401, errUnAuthorized)
  }
}

export default userExtractor
