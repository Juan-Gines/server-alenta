import mongoose from 'mongoose'

const connectDB = (url) => mongoose.connect(url).then(() => console.log('Database connected')).catch((error) => {
  console.error('No se ha podido conectar a la base de datos. ', error)
})

export default connectDB
