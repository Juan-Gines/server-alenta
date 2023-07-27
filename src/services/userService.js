import UserModel from '#Models/user.js'
import { CustomError } from '#Errors/CustomError.js'
import { errorMessageES } from '#Lang/es/errorMessage.js'

// * Error messages

const { errEmpyUser, errEmpyUsers, errUnAuthorized } = errorMessageES.user

// * Return all users from DB

const getAllUsers = async () => {
  try {
    const users = await UserModel.find({})

    if (users.length === 0) {
      throw new CustomError(404, errEmpyUsers)
    }
    return users
  } catch (error) {
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

// * Return boolean if exist

const userExist = (userId) => {
  try {
    const exist = UserModel.exists({ _id: userId })
    return exist
  } catch (error) {
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

// * Return one user from DB

const getOneUser = async (userId) => {
  try {
    const user = UserModel.findById(userId).exec()

    if (!user) {
      throw new CustomError(401, errUnAuthorized)
    }
    return user
  } catch (error) {
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

// * Update one user and return this users from DB

const updateOneUser = async (userId, changes) => {
  try {
    const userForUpdate = await UserModel.findByIdAndUpdate(userId, changes, { new: true })
    if (!userForUpdate) {
      throw new CustomError(404, errEmpyUser)
    }
    return userForUpdate
  } catch (error) {
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

// * Delete one user from DB

const deleteOneUser = async (userId) => {
  try {
    const userDeleted = await UserModel.findByIdAndDelete(userId)
    if (!userDeleted) {
      throw new CustomError(404, errEmpyUser)
    }
    return { message: `El usuario ${userDeleted.name}, Ha sido borrado con éxito.` }
  } catch (error) {
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

export default {
  getAllUsers,
  getOneUser,
  updateOneUser,
  deleteOneUser,
  userExist
}
