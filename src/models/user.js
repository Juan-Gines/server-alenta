import mongoose, { model } from 'mongoose'
const { Schema } = mongoose

// * Schema from UserModel

const userSchema = new Schema({
  name: { type: String, trim: true, require: true, minLength: 4, maxLength: 25 },
  surname: { type: String, trim: true, minLength: 4, maxLength: 50 },
  image: { type: String, trim: true, minLength: 4, maxLength: 50 },
  email: { type: String, trim: true, lowercase: true, require: true, unique: true },
  role: { type: String, trim: true, enum: ['user', 'family', 'admin', 'friend'], default: 'user', require: true },
  password: { type: String, trim: true, require: true }
}, {
  timestamps: true
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
