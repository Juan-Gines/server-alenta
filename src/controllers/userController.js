const userService = require('../services/userService');

const getAllUsers = (req, res) => {
  const { name } = req.query;
  try {
    const allUsers = userService.getAllUsers({ name });
    res.json({ status: 'OK', data: allUsers});
  } catch (error) {
    res
      .status(error?.status || 500)
      .json({ status : "FAILED", data: { error: error?.message || error}});
  }
}

const getOneUser = (req, res) => {
  const { params: { userId } } = req;

  if (!userId) {
    return res.status(400).json({
      status: 'FAILED',
      data: { error: "Parametro ':userId' no puede estar vacio."},
    })
  }
  try {
    const user = userService.getOneUser(userId);
    res.json({ status: 'OK', data: user })
  } catch (error) {
    res
      .status(error?.status || 500)
      .json({ status: 'FAILED', data: { error: error?.message || error }});
  }
}

const createNewUser = (req, res) => {
  const { body } = req;
  if (
    !body.name ||
    !body.email ||
    !body.password
  ) {
    return res.status(400).json({
      status: 'FAILED',
      data: {
        error:
          "Uno de los campos 'name', 'email' o 'password' no existe o está vacio en el cuerpo."
      }
    })
  }
  const newUser = {
    name: body.name,
    email: body.email,
    password: body.password
  }
  try {
    const createdUser = userService.createNewUser(newUser);
    res.status(201).json({ status: 'OK', data: createdUser});
  } catch (error) {
    res
      .status(error?.status || 500)
      .json({ status: 'FAILED', data: { error: error?.message || error }})
  }
}

const updateOneUser = (req, res) => {
  const { body, params: { userId } } = req;

  console.log(body, userId)

  if (!userId) {
		return res.status(400).json({
			status: 'FAILED',
			data: { error: "Parametro ':userId' no puede estar vacio." },
		});
	}

  try {
    const updatedUser = userService.updateOneUser(userId, body);
    res.json({ status: 'OK', data: updatedUser});
  } catch (error) {
    res
			.status(error?.status || 500)
			.json({ status: 'FAILED', data: { error: error?.message || error } });
  }
}

const deleteOneUser = (req, res) => {
  const {	params: { userId },	} = req;

  if (!userId) {
		return res.status(400).json({
			status: 'FAILED',
			data: { error: "Parametro ':userId' no puede estar vacio." },
		});
	}

  try {
    userService.deleteOneUser(userId);
    res.status(204).send({ status: 'OK' });
  } catch (error) {
    res
			.status(error?.status || 500)
			.send({ status: 'FAILED', data: { error: error?.message || error } });
  }
}

module.exports = {
  createNewUser,
  getAllUsers,
  getOneUser,
  updateOneUser,
  deleteOneUser
}