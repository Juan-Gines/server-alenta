import  { v4 } from 'uuid';
import User from '#Models/user.js';
import { hash } from 'bcrypt'; 
import { SALT } from '#Constants/salt.js';

const getAllUsers = async () => { 
  try { 
    const users = await User.find().exec();
      if (!users) {
        throw { 
          status: 404, 
          message: 'No existen usuarios' 
        };
      }
      return users.map(d => omitPassword(d));
  } catch (error) {
    throw {
      status: error?.status || 500,
      message: error?.message || error,
    };
  } 
}

const getOneUser = async (userId) => { 
  try {
    const user = await User.findById(userId).exec();
    if (!user)
      throw {
        status: 401,
        message: 'Usuario no autorizado',
      };    
    return omitPassword(user);
  } catch (error) {
    throw {
      status: error?.status || 500,
      message: error?.message || error,
    };
  } 
}

const createNewUser = async (newUser) => {
  try {
    const { email, password } = newUser;
    const existingUserByEmail = await User.findOne({ email }).exec();
    if (existingUserByEmail)
      throw {
        status: 409,
        message: 'Ya existe un usuario con ese email registrado',
      };
    const userToInsert = {
      ...newUser,
      _id: v4(),
      password: await hash(password, SALT),
    };

    const createdUser = new User(userToInsert);
    await createdUser.save();
    return omitPassword(createdUser);    
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
}

const updateOneUser = async (userId, changes) => {
  try {
    const userForUpdate = await User.findByIdAndUpdate(userId, changes).exec();
    if (!userForUpdate) {
      throw {
        status: 404,
        message: `El usuario con id '${userId} no existe.`,
      };
    }
    const updatedUser = await User.findById(userForUpdate._id).exec();
    return omitPassword(updatedUser);
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
}

const deleteOneUser = async (userId) => {
  try {
		const userDeleted = await User.findByIdAndDelete(userId).exec();
    if (!userDeleted){
      throw {
        status: 404,
        message: `El usuario con id '${userId} no existe.`,
      };
    }
    return {message: `El usuario ${userDeleted.name}, Ha sido borrado con éxito.`};    
	} catch (error) {
		throw { status: error?.status || 500, message: error?.message || error };
	}
}

const omitPassword = (user) => {
  const { password, __v, ...userWithoutPassword } = user._doc;
  return userWithoutPassword;
};

export default {
  createNewUser,
  getAllUsers,
  getOneUser,
  updateOneUser,
  deleteOneUser,
};
