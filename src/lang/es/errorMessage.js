export const errorMessageES = Object.freeze({
  user: {
    errLogin: 'Credenciales inválidas',
    errFormatObject: 'El formato del objeto no es válido.',
    errFormatEmail: 'El formato de email no es válido, debe cumplir el RFC 5322.',
    errFormatPassword: 'El formato del password debe contener una mayúscula, una minúscula y un número al menos.',
    errRequired: (campo) => `El campo ${campo} es requerido`,
    errTypeString: 'El tipo debe ser una cadena de caracteres.',
    errMinLength: (min) => `El texto debe tener al menos, ${min} caracteres .`,
    errMaxLength: (max) => `El texto debe tener como máximo ${max} caracteres .`,
    errUnAuthorized: 'Usuario no autorizado',
    errRoleEnum: 'No es un rol válido',
    errEmpyUsers: 'No existen usuarios',
    errEmpyUser: 'Este usuario no existe',
    errEmailDuplicated: 'Ya existe un usuario con ese email registrado'
  }
})
