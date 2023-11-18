const allowedOrigins = ['http://localhost:5173']

const corsOptions = {
  origin: allowedOrigins,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
}

export default corsOptions
