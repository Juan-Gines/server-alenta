import express from 'express'
import cors from 'cors'
import userRouter from '#Routes/userRoutes.js'
import authRouter from '#Routes/authRoutes.js'
import postRouter from '#Routes/postRoutes.js'
import imageRouter from '#Routes/imageRoutes.js'
import notFound from '#Errors/notFound.js'
import handleErrors from '#Errors/handleErrors.js'

const expressApp = express()

expressApp.disable('x-powered-by')

// Middlewares
expressApp.use(express.json())
expressApp.use(cors())

// Routes
expressApp.use('/api/users', userRouter)
expressApp.use('/api/auth', authRouter)
expressApp.use('/api/posts', postRouter)
expressApp.use('/api/images', imageRouter)

// Errors
expressApp.use(notFound)
expressApp.use(handleErrors)

export default expressApp
