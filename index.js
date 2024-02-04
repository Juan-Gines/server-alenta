import '#Config/env.js'
import expressApp from '#Config/express.js'

const PORT = process.env.PORT || 3000
// Determina la URL de conexión según el entorno

expressApp.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`)
})
