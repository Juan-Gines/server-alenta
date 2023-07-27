import { CustomError } from '#Errors/CustomError.js'
import UserModel from '#Models/user.js'
import { compare, hash } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { errorMessageES } from '#Lang/es/errorMessage.js'
import { SALT } from '#Constants/salt.js'

// ! Error messages

const { errLogin, errEmpyUser, errEmailDuplicated } = errorMessageES.user

// * Update password this users from DB

const loginUser = async (email, password) => {
  try {
    const user = await UserModel.findOne({ email }).exec()
    if (!user) {
      throw new CustomError(401, errLogin)
    }
    const correctPass = await compare(password, user.password)
    if (!correctPass) {
      throw new CustomError(401, errLogin)
    }
    const userForToken = {
      id: user._id,
      username: user.name
    }
    const token = jwt.sign(userForToken, process.env.JWT_PRIVATE_KEY, {
      expiresIn: 60 * 60
    })
    return { token }
  } catch (error) {
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

// * Create new user and return this new user from DB

const registerNewUser = async (newUser) => {
  const { email, password } = newUser
  try {
    const user = await UserModel.findOne({ email })

    if (user) {
      throw new CustomError(409, errEmailDuplicated)
    }

    const passHassed = await hash(password, SALT)
    const userToInsert = {
      ...newUser,
      password: passHassed
    }
    const createdUser = new UserModel(userToInsert)
    await createdUser.save()
    return createdUser
  } catch (error) {
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

const updatePasswordUser = async (userId, changes) => {
  const { oldPassword, newPassword } = changes
  try {
    const user = await UserModel.findById(userId)
    if (!user) {
      throw new CustomError(401, errEmpyUser)
    }
    const correctPass = await compare(oldPassword, user.password)
    if (!correctPass) {
      throw new CustomError(401, errLogin)
    }
    const hashedPass = await hash(newPassword, SALT)
    const updatedUser = await UserModel.findByIdAndUpdate(userId, { password: hashedPass }, { new: true })
    return { message: `El password de ${updatedUser.name} se cambió correctamente.` }
  } catch (error) {
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

export default {
  loginUser,
  updatePasswordUser,
  registerNewUser
}
