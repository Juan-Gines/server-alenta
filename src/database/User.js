const DB = require('./db.json');
const { saveToDatabase } = require('./utils');



const getAllUsers = (filterParams) => {
  try {
		const users = DB.users;
		if (filterParams.name) {
			return DB.users.filter((user) =>
				user.name.toLowerCase().includes(filterParams.name)
			);
		}
		return users.map(u => omitPassword(u));
	} catch (error) {
		throw { status: 500, message: error };
	}
}

const getOneUser = (userId) => {
  try {
    const user = DB.users.find((u) => u.id === userId);
    if (!user) {
      throw {
        status: 404,
        message: `El usuario con id '${userId} no existe.`
      }
    }
    return omitPassword(user);  
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
}

const createNewUser = (newUser) => {
  try {
    const isAlreadyAdded =
      DB.users.findIndex((u) => u.email === newUser.email) > -1;
    if (isAlreadyAdded) {
      throw {
        status: 400,
        message: `Ya existe un usuario con el email ${newUser.email}`
      }
    }
    DB.users.push(newUser);
    saveToDatabase(DB);
    setTimeout(() => console.log('Archivo guardado'),3000);
    return omitPassword(newUser);
  } catch (error) {
    throw { status: 500, message: error?.message || error};
  }
}

const updateOneUser = (userId, changes) => {
  try {
    const indexForUpdated = DB.users.findIndex(u => u.id === userId);

    if (indexForUpdated === -1) {
      throw {
				status: 404,
				message: `El usuario con id '${userId} no existe.`,
			};
    }

    const updatedUser = {
      ...DB.users[indexForUpdated],
      ...changes,
      updatedAt: new Date().toLocaleString()
    };

    DB.users[indexForUpdated] = updatedUser;
    saveToDatabase(DB);
    return omitPassword(updatedUser);
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
}

const deleteOneUser = (userId) => {
  try {
    const indexForDelete = DB.users.findIndex(u => u.id === userId);

    if (indexForDelete === -1) {
      throw {
				status: 404,
				message: `El usuario con id '${userId} no existe.`,
			};
    }

    DB.users.splice(indexForDelete, 1);
    saveToDatabase(DB);
  } catch (error) {
    throw { status: error?.status || 500, message: error?.message || error };
  }
}

const omitPassword = (user) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

module.exports = {
  createNewUser,
  getAllUsers,
  getOneUser,
  updateOneUser,
  deleteOneUser
}