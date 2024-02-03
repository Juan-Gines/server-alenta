// import connectDB from '#Config/db.js'
// import '#Config/env.js'
// import expressApp from '#Config/express.js'

// const { MONGODB_URL, MONGODB_URL_TEST, NODE_ENV } = process.env

// // ? Utilizamos otra base de datos para el test

// const connectionString = NODE_ENV === 'test'
//   ? MONGODB_URL_TEST
//   : MONGODB_URL

// await connectDB(connectionString)

// const server = expressApp.listen(process.env.PORT, () => {
//   console.log(`Servidor escuchando en el puerto http://localhost:${process.env.PORT}`)
// })

// export default server

import express from 'express'
const app = express()

const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  const htmlResponse = `
    <html>
      <head>
        <title>NodeJs y Express en Vercel</title>
      </head>
      <body>
        <h1>Soy un proyecto Back end en vercel</h1>
      </body>
    </html>
  `
  res.send(htmlResponse)
})

app.listen(port, () => {
  console.log(`port runing in http://localhost:${port}`)
})
