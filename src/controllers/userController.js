import userService from '#Services/userService.js';

const getAllUsers = (req, res) => {
  userService
    .getAllUsers()    
    .then(data => res.json({ status: 'OK', data }))
    .catch(error =>{
      res
        .status(error?.status || 500)
        .json({ status: 'FAILED', data: { error: error?.message || error } });
    });  
}

const getOneUser = async (req, res) => {
  const { params: { userId } } = req;

  if (!userId) {
    return res.status(400).json({
      status: 'FAILED',
      data: { error: "Parametro ':userId' no puede estar vacio."},
    })
  }
  userService
    .getOneUser(userId)
    .then(data => res.json({ status: 'OK', data }))
    .catch(error =>{
      res
        .status(error?.status || 500)
        .json({ status: 'FAILED', data: { error: error?.message || error } });
    });
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
  
  userService
    .createNewUser(newUser)
    .then(createdUser => res.status(201).json({ status: 'OK', data: createdUser}))
    .catch(error => { 
      res
        .status(error?.status || 500)
        .json({ status: 'FAILED', data: { error: error?.message || error }});
    })    
}

const updateOneUser = (req, res) => {
  const { body, params: { userId } } = req;
  if (!userId) {
		return res.status(400).json({
			status: 'FAILED',
			data: { error: "Parametro ':userId' no puede estar vacio." },
		});
	}

  userService
    .updateOneUser(userId, body)
    .then(updatedUser => res.json({ status: 'OK', data: updatedUser }))
    .catch (error => {
      res
        .status(error?.status || 500)
        .json({ status: 'FAILED', data: { error: error?.message || error } })
    });
}


const deleteOneUser = (req, res) => {
  const {	params: { userId } } = req;
  if (!userId) {
		return res.status(400).json({
			status: 'FAILED',
			data: { error: "Parametro ':userId' no puede estar vacio." },
		});
	}

  userService
    .deleteOneUser(userId)
    .then(deletedUser => {
      res        
        .json({ status: 'OK', data: deletedUser })})
    .catch((error) => {
      res
        .status(error?.status || 500)
        .json({ status: 'FAILED', data: { error: error?.message || error } });
    });
}

export { 
  getAllUsers, 
  getOneUser, 
  createNewUser, 
  updateOneUser, 
  deleteOneUser 
};