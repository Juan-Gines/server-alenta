const express = require('express');
const cors = require('cors');
const v1UserRouter = require('./routes/userRoutes');
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/api/v1/users', v1UserRouter);

app.listen(PORT, () => console.log(`Servidor ejecutandose en puerto ${PORT}`));