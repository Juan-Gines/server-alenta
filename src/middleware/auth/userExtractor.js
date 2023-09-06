import { CustomError } from '#Errors/CustomError.js'
import { errorMessageES } from '#Lang/es/errorMessage.js'
import { userExist } from '#Services/userService.js'
import jwt from 'jsonwebtoken'

// ! Error messages

const { errUnAuthorized } = errorMessageES

// * Token verification return id

const userExtractor = async (req, res, next) => {
  const { authorization } = req.headers
  try {
    if (!authorization) {
      throw errUnAuthorized
    }

    const token = authorization.split(' ')[1]

    if (!token) {
      throw errUnAuthorized
    }
    const decodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
    const user = await userExist(decodedToken.id)
    if (!user) {
      throw errUnAuthorized
    }
    req.user = user
    next()
  } catch (error) {
    const errorCustom = new CustomError(error?.status ?? 401, error?.message ?? error)
    next(errorCustom)
  }
}

export default userExtractor
