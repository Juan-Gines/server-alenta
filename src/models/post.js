import mongoose, { model } from 'mongoose'
const { Schema } = mongoose

// * Schema from PostModel

const postSchema = new Schema({
  title: { type: String, trim: true, require: true, minLength: 4, maxLength: 50 },
  extract: { type: String, trim: true, require: true, minLength: 4, maxLength: 100 },
  poster: { type: Schema.Types.ObjectId, trim: true, ref: 'Image' },
  images: [{ type: Schema.Types.ObjectId, trim: true, ref: 'Image' }],
  body: { type: String, trim: true, require: true, minLength: 4, maxLength: 1000 },
  user: { type: Schema.Types.ObjectId, trim: true, required: true, ref: 'User' }
}, {
  timestamps: true
})

postSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const PostModel = model('Post', postSchema)

export default PostModel
