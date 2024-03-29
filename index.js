import connectDB from '#Config/db.js'
import '#Config/env.js'
import expressApp from '#Config/express.js'

const { MONGODB_URI, MONGODB_URL_TEST, NODE_ENV } = process.env

// ? Utilizamos otra base de datos para el test

const connectionString = NODE_ENV === 'test'
  ? MONGODB_URL_TEST
  : MONGODB_URI

await connectDB(connectionString)

const server = expressApp.listen(process.env.PORT, () => {
  console.log(`Servidor escuchando en el puerto http://localhost:${process.env.PORT}`)
})

export default server
