import mongoose, { model } from 'mongoose'
const { Schema } = mongoose

// * Schema from PostModel

const imageSchema = new Schema({
  imageName: { type: String, trim: true, require: true },
  path: { type: String, trim: true, require: true },
  bytes: { type: Number, trim: true, require: true, maxLength: 2048 },
  user: { type: Schema.Types.ObjectId, trim: true, required: true, ref: 'User' },
  post: { type: Schema.Types.ObjectId, trim: true, ref: 'Post' }
}, {
  timestamps: true
})

imageSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const ImageModel = model('Image', imageSchema)

export default ImageModel
