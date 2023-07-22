import User from '#Models/user.js'
import { hash } from 'bcrypt'
import { SALT } from '#Constants/salt.js'
import { CustomError } from '#Errors/CustomError.js'
import { errorMessageES } from '#Lang/es/errorMessage.js'

const { errEmailDuplicated, errEmpyUser, errEmpyUsers, errUnAuthorized } = errorMessageES.user

const getAllUsers = () => {
  const users = User.find()
    .then((res) => {
      if (res.length === 0) {
        throw new CustomError(404, errEmpyUsers)
      }
      return res
    })
    .catch((error) => {
      throw new CustomError(error?.status ?? 500, error?.message ?? error)
    })
  return users
}

const getOneUser = (userId) => {
  const user = User.findById(userId)
    .then((res) => {
      if (!res) {
        throw new CustomError(401, errUnAuthorized)
      }
      return res
    })
    .catch((error) => {
      throw new CustomError(error?.status ?? 500, error?.message ?? error)
    })
  return user
}

const createNewUser = (newUser) => {
  const { email, password } = newUser
  const user = User.findOne({ email })
    .then(userChecked => {
      if (userChecked) {
        throw new CustomError(409, errEmailDuplicated)
      }
    })
    .then(() => {
      const passHassed = hash(password, SALT)
        .then(p => p)
      return passHassed
    })
    .then(passHassed => {
      const userToInsert = {
        ...newUser,
        password: passHassed
      }
      const createdUser = new User(userToInsert)
      createdUser.save()
      return createdUser
    })
    .catch(error => {
      throw new CustomError(error?.status ?? 500, error?.message ?? error)
    })
  return user
}

const updateOneUser = (userId, changes) => {
  const userForUpdate = User.findByIdAndUpdate(userId, changes, { new: true })
    .then(user => {
      if (!user) {
        throw new CustomError(404, errEmpyUser)
      }
      return user
    })
    .catch(error => {
      throw new CustomError(error?.status ?? 500, error?.message ?? error)
    })
  return userForUpdate
}

const deleteOneUser = async (userId) => {
  try {
    const userDeleted = await User.findByIdAndDelete(userId).exec()
    if (!userDeleted) {
      throw new CustomError(404, errEmpyUser)
    }
    return { message: `El usuario ${userDeleted.name}, Ha sido borrado con éxito.` }
  } catch (error) {
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

export default {
  createNewUser,
  getAllUsers,
  getOneUser,
  updateOneUser,
  deleteOneUser
}
