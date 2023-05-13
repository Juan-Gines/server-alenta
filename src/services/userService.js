const { v4: uuid } = require('uuid');
const User = require('../database/User');
const bcrypt = require('bcryptjs');

const getAllUsers = (filterParams) => {
  try {
		const allUsers = User.getAllUsers(filterParams);
		return allUsers;
	} catch (error) {
		throw error;
	}
}

const getOneUser = (userId) => {
  try {
    const user = User.getOneUser(userId);
    return user;
  } catch (error) {
    throw error;
  }
}

const createNewUser = (newUser) => {
  const userToInsert = {
    ...newUser,
    id: uuid(),
    password: bcrypt.hashSync(newUser.password, 10),
    createdAt: new Date().toLocaleString(),
    updatedAt: new Date().toLocaleString(),
  };
  try {
    const createdUser = User.createNewUser(userToInsert);
    return createdUser;
  } catch (error) {
    throw error;
  }
}

const updateOneUser = (userId, changes) => {
  try {
    const updatedUser = User.updateOneUser(userId, changes);
    return updatedUser;
  } catch (error) {
    throw error;
  }
}

const deleteOneUser = (userId) => {
  try {
		const deletedUser = User.deleteOneUser(userId);
	} catch (error) {
		throw error;
	}
}

module.exports = {
  createNewUser,
  getAllUsers,
  getOneUser,
  updateOneUser,
  deleteOneUser
}