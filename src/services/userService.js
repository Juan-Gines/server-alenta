import UserModel from '#Models/user.js'
import { CustomError } from '#Errors/CustomError.js'

// * Error messages

// * Return all users from DB

const getAllUsers = async () => {
  try {
    const users = await UserModel.find({})
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
    return user
  } catch (error) {
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

// * Update one user and return this users from DB

const updateOneUser = async (userId, changes) => {
  try {
    const userForUpdate = await UserModel.findByIdAndUpdate(userId, changes, { new: true })
    return userForUpdate
  } catch (error) {
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

// * Delete one user from DB

const deleteOneUser = async (userId) => {
  try {
    const userDeleted = await UserModel.findByIdAndDelete(userId)
    return { message: `El usuario "${userDeleted.name}", ha sido borrado con éxito.` }
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
