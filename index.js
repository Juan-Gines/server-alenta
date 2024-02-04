import connectDB from '#Config/db.js'
import '#Config/env.js'
import expressApp from '#Config/express.js'

const { MONGODB_URL, MONGODB_URL_TEST, NODE_ENV, PORT } = process.env

// Determina la URL de conexión según el entorno
const connectionString = NODE_ENV === 'test' ? MONGODB_URL_TEST : MONGODB_URL

let server
// Conecta a la base de datos
connectDB(connectionString)
  .then(() => {
    // Inicia el servidor
    server = expressApp.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`)
    })
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error)
  })

export default server
