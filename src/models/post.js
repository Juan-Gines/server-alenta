import { deleteImages, deleteOneImage, updateImages, updateOneImage } from '#Services/imageService.js'
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

postSchema.post('save', async function (post) {
  const { images, poster, _id } = post
  if (images) await updateImages(images, { post: _id })
  if (poster) await updateOneImage(poster, { post: _id })
})

postSchema.post('findOneAndDelete', async function (post) {
  const { images, poster } = post
  if (images) await deleteImages(images)
  if (poster) await deleteOneImage(poster)
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
