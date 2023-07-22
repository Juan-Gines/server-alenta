import { CustomError } from '#Errors/CustomError.js'
import UserModel from '#Models/user.js'
import { compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { errorMessageES } from '#Lang/es/errorMessage.js'

const { errLogin } = errorMessageES.user

const userLoginController = (req, res, next) => {
  const { email, password } = req.body
  UserModel.findOne({ email })
    .then((user) => {
      if (!user) {
        next(new CustomError(401, errLogin))
      } else {
        compare(password, user.password)
          .then((correctPassword) => {
            if (correctPassword) {
              const userForToken = {
                id: user._id,
                username: user.name
              }
              const token = jwt.sign(userForToken, process.env.JWT_PRIVATE_KEY, {
                expiresIn: 60 * 60
              })
              res.json({
                status: 'OK',
                data: { name: userForToken.username, token }
              })
            } else {
              next(new CustomError(401, errLogin))
            }
          })
      }
    })
    .catch(error =>
      next(error)
    )
}

export default userLoginController
