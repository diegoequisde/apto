const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API funcionando');
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API funcionando correctamente'
  });
});

module.exports = app;

