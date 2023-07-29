import { CustomError } from '#Errors/CustomError.js'
import { errorMessageES } from '#Lang/es/errorMessage.js'
import userService from '#Services/userService.js'
import jwt from 'jsonwebtoken'

// ! Error messages

const { errUnAuthorized } = errorMessageES.user

// * Token verification return id

const userExtractor = async (req, res, next) => {
  const { authorization } = req.headers
  try {
    if (!authorization) {
      throw new CustomError(401, errUnAuthorized)
    }

    const token = authorization.split(' ')[1]

    if (!token) {
      throw new CustomError(401, errUnAuthorized)
    }
    const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
    const userExist = await userService.userExist(decodedToken.id)
    if (!userExist) {
      throw new CustomError(401, errUnAuthorized)
    }
    req.userId = decodedToken.id
    next()
  } catch (error) {
    next(error)
  }
}

export default userExtractor
