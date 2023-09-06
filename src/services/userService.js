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
    const user = UserModel.findById(userId)
    return user
  } catch (error) {
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

// * Update one user and return this users from DB

const updateOneUser = async (user, changes) => {
  const { _id } = user
  try {
    const userForUpdate = await UserModel.findByIdAndUpdate(_id, changes, { new: true }).populate('avatar', {
      path: 1,
      imageName: 1
    })
    return userForUpdate
  } catch (error) {
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

// * Delete one user from DB

const deleteOneUser = async (user) => {
  const { _id } = user
  try {
    const userDeleted = await UserModel.findByIdAndDelete(_id).populate(['avatar', 'posts'])
    return userDeleted
  } catch (error) {
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

export {
  getAllUsers,
  updateOneUser,
  deleteOneUser,
  userExist
}
