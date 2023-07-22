import mongoose, { model } from 'mongoose'
const { Schema } = mongoose

const userSchema = new Schema({
  name: { type: String, require: true, minLength: 4, maxLength: 25 },
  surname: { type: String, minLength: 4, maxLength: 50 },
  image: { type: String, minLength: 4, maxLength: 50 },
  email: { type: String, require: true, unique: true },
  role: { type: String, enum: ['user', 'family', 'admin', 'friend'], default: 'user', require: true },
  password: { type: String, require: true }
}, {
  timestamps: true
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const UserModel = model('User', userSchema)

export default UserModel
