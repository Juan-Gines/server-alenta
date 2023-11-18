export const errorMessageES = Object.freeze({

  errLogin: 'Credenciales inválidas',
  errFormatObject: 'El formato del objeto no es válido.',
  errFormatEmail: 'El email no es válido.',
  errFormatPassword: 'El Password debe contener una mayúscula, una minúscula y un número.',
  errRequired: (campo) => `El campo ${campo} es requerido`,
  errTypeString: 'El tipo debe ser una cadena de caracteres.',
  errMinLength: (min) => `El texto debe tener al menos, ${min} caracteres .`,
  errMaxLength: (max) => `El texto debe tener como máximo ${max} caracteres .`,
  errUnAuthorized: 'Usuario no autorizado.',
  errRoleEnum: 'No es un rol válido.',
  errEmptyUsers: 'No existen usuarios.',
  errEmptyUser: 'Este usuario no existe.',
  errEmailDuplicated: 'Ya existe un usuario con ese email registrado.',
  errNotEmail: 'No existe este email.',
  errNewPassEqualToOld: 'El nuevo password no puede ser igual al antiguo.',
  errPassMatch: 'Las contraseñas no coinciden.',
  errEmptyPosts: 'No existen posts.',
  errEmptyPost: 'Este post no existe.',
  errEmptyImages: 'No existen imagenes.',
  errEmptyImage: 'Esta imagen no existe',
  errIdErroneo: 'El id que intenta buscar es erróneo.',
  errMaxImages: 'No puedes poner más imágenes.',
  errMinimum: (min) => `El número no puede ser menor a ${min}.`,
  errMaximum: (max) => `El número no puede ser menor a ${max}.`,
  errTypeNumber: 'El tipo debe ser un número.',
  errTypeObject: 'El tipo debe ser un objeto.',
  errTypeArray: 'El tipo debe ser un array.',
  errTypeBoolean: 'El tipo debe ser un boleano.'
})
