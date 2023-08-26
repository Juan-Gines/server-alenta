import { SALT } from '#Constants/salt.js'
import { CustomError } from '#Errors/CustomError.js'
import imageService from '#Services/imageService.js'
import { hash } from 'bcrypt'
import mongoose, { model } from 'mongoose'
const { Schema } = mongoose

// * Schema from UserModel

const userSchema = new Schema({
  name: { type: String, trim: true, require: true, minLength: 4, maxLength: 25 },
  surname: { type: String, trim: true, minLength: 4, maxLength: 50 },
  avatar: { type: Schema.Types.ObjectId, trim: true, ref: 'Image' },
  email: { type: String, trim: true, lowercase: true, require: true, unique: true },
  role: { type: String, trim: true, enum: ['user', 'family', 'admin', 'friend'], default: 'user', require: true },
  password: { type: String, trim: true, require: true },
  posts: [{ type: Schema.Types.ObjectId, trim: true, ref: 'Post' }]
}, {
  timestamps: true
})

userSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      const passHassed = await hash(this.password, SALT)
      this.password = passHassed
    }
    next()
  } catch (error) {
    next(new CustomError(error?.status ?? 500, error?.message ?? error))
  }
})

userSchema.pre('findOneAndUpdate', async function (next) {
  const newAvatar = this.getUpdate().avatar
  try {
    if (newAvatar) {
      const user = await this.model.findOne(this.getQuery())
      if (!user.avatar) {
        this.getUpdate().avatar = (await imageService.createOneImage(this.getFilter(), newAvatar))._id
      } else {
        this.getUpdate().avatar = user.avatar
        await imageService.updateOneImage(user.avatar, newAvatar)
      }
    }
    next()
  } catch (error) {
    next(new CustomError(error?.status ?? 500, error?.message ?? error))
  }
  next()
})

userSchema.post('findOneAndDelete', async function (user) {
  const { avatar } = user
  try {
    if (avatar) await imageService.deleteOneImage(avatar)
  } catch (error) {
    throw new CustomError(500, error)
  }
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.password
  }
})

const UserModel = model('User', userSchema)

export default UserModel
