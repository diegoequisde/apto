const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const temaRoutes = require('./routes/temaRoutes');
const preguntaRoutes = require('./routes/preguntaRoutes');
const testRoutes = require('./routes/testRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const oposicionRoutes = require('./routes/oposicionRoutes');

const errorHandler = require('./middlewares/errorHandler');

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

app.use('/api/temas', temaRoutes);
app.use('/api/preguntas', preguntaRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/oposiciones', oposicionRoutes);

app.use(errorHandler);

module.exports = app;