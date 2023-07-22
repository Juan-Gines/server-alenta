import mongoose from 'mongoose'

const connectDB = (url) => mongoose.connect(url).then(() => console.log('Database connected')).catch(error => {
  throw new Error({ status: 500, message: error })
})

export default connectDB
