const allowedOrigins = ['http://localhost:5173', 'https://alentaweb.vercel.app']

const corsOptions = {
  origin: allowedOrigins,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
}

export default corsOptions
