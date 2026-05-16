const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API funcionando');
});

app.get('/db-test', async (req, res) => {

    try {

        const [rows] = await pool.query(
            'SELECT NOW() AS fecha'
        );

        res.json({
            ok: true,
            fecha_servidor: rows[0].fecha
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            ok: false,
            mensaje: 'Erro na conexión coa base de datos'
        });

    }

});

module.exports = app;