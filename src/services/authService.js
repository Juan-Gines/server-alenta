import { CustomError } from '#Errors/CustomError.js'
import UserModel from '#Models/user.js'
import { compare, hash } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { errorMessageES } from '#Lang/es/errorMessage.js'
import { SALT } from '#Constants/salt.js'
import { emailOptions, subjects } from '#Utils/predefinedEmails.js'
import { transporter } from '#Config/emailConfig.js'

// ! Error messages

const { errLogin, errEmailDuplicated, errNotEmail } = errorMessageES

// * Login de usuario

const loginUser = async (email, password) => {
  try {
    const user = await UserModel.findOne({ email }).exec()
    if (!user) {
      throw new CustomError(401, errLogin)
    }
    const correctPass = await compare(password, user.password)
    if (!correctPass) {
      throw new CustomError(401, errLogin)
    }
    const userForToken = {
      id: user._id
    }
    const token = jwt.sign(userForToken, process.env.JWT_PRIVATE_KEY, {
      expiresIn: 60 * 60
    })
    return { token, user }
  } catch (error) {
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

// * Registra un nuevo usuario

const registerNewUser = async (newUser) => {
  const { email } = newUser
  try {
    const user = await UserModel.findOne({ email })

    if (user) {
      throw new CustomError(409, errEmailDuplicated)
    }

    const createdUser = new UserModel(newUser)
    await createdUser.save()
    const userForToken = {
      id: createdUser._id
    }
    const token = jwt.sign(userForToken, process.env.JWT_PRIVATE_KEY, { expiresIn: '1d' })
    const tokenReplaceUrl = encodeURI(token.replaceAll('.', ' '))
    const resetPasswordLink = `${process.env.CLIENT_URL}activar-cuenta/${tokenReplaceUrl}`
    const emailSend = emailOptions(email, subjects.resetPassword, `Pinche en este enlace para activar su cuenta: ${resetPasswordLink}`)
    await transporter.sendMail(emailSend)
    return createdUser
  } catch (error) {
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

// * Cambiamos el password de un usuario

const updatePasswordUser = async (user, changes) => {
  const { oldPassword, newPassword } = changes
  try {
    const correctPass = await compare(oldPassword, user.password)
    if (!correctPass) {
      throw new CustomError(401, errLogin)
    }
    const hashedPass = await hash(newPassword, SALT)
    const updatedUser = await UserModel.findByIdAndUpdate({ id: user.id }, { password: hashedPass }, { new: true })
    return { message: `El password de ${updatedUser.name} se cambió correctamente.` }
  } catch (error) {
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

// * Activar usuario

const activeUser = async () => {
  try {
    const hashedPass = await hash(password, SALT)
    const updatedUser = await UserModel.findByIdAndUpdate(user._id, { password: hashedPass }, { new: true })
    return { message: `El password de ${updatedUser.name} se reseteó correctamente.` }
  } catch (error) {
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

// * Enviamos email de recuperación de password

const forgotPassword = async (email) => {
  try {
    const user = await UserModel.findOne({ email })
    if (!user) {
      throw new CustomError(401, errNotEmail)
    }
    const userForToken = {
      id: user._id
    }
    const token = jwt.sign(userForToken, process.env.JWT_PRIVATE_KEY, { expiresIn: '1h' })
    const tokenReplaceUrl = encodeURI(token.replaceAll('.', ' '))
    const resetPasswordLink = `${process.env.CLIENT_URL}reset-password/${tokenReplaceUrl}`
    const emailSend = emailOptions(email, subjects.resetPassword, `Pinche en este enlace para recuperar su contraseña: ${resetPasswordLink}`)
    await transporter.sendMail(emailSend)
    return { message: 'correo electrónico enviado' }
  } catch (error) {
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

// * reseteamos el password olvidado del usuario

const resetPassword = async (user, password) => {
  try {
    const hashedPass = await hash(password, SALT)
    const updatedUser = await UserModel.findByIdAndUpdate(user._id, { password: hashedPass }, { new: true })
    return { message: `El password de ${updatedUser.name} se reseteó correctamente.` }
  } catch (error) {
    throw new CustomError(error?.status ?? 500, error?.message ?? error)
  }
}

export {
  loginUser,
  updatePasswordUser,
  registerNewUser,
  forgotPassword,
  resetPassword,
  activeUser
}
