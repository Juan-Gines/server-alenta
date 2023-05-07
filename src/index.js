const express = require('express');
const cors = require('cors');
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('<h1>¡Hola Mundo!</h1>');
})

app.listen(PORT, () => console.log(`Servidor ejecutandose en puerto ${PORT}`));