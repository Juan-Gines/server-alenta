import express from 'express'
import cors from 'cors'
import userRouter from '#Routes/userRoutes.js'
import authRouter from '#Routes/authRoutes.js'
import notFound from '#Errors/notFound.js'
import handleErrors from '#Errors/handleErrors.js'

const expressApp = express()

// Middlewares
expressApp.use(express.json())
expressApp.use(cors())

// Routes
expressApp.use('/users', userRouter)
expressApp.use('/auth', authRouter)

// Errors
expressApp.use(notFound)
expressApp.use(handleErrors)

export default expressApp
