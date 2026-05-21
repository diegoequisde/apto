const pool = require('../config/db');

const findAllTemas = async () => {

    const [rows] = await pool.query(`
        SELECT 
            id_tema,
            nome_tema,
            descripcion_tema,
            estado_tema
        FROM tema
        WHERE estado_tema = 'activo'
    `);

    return rows;

};

module.exports = {
    findAllTemas
};

