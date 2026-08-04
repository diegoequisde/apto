const pool = require('../config/db');

const findAllPreguntas = async (
    page = 1,
    limit = 20,
    idTema = null,
    usuario
) => {

    const offset =
        (page - 1) * limit;

    let where =
        `WHERE p.estado_pregunta = 'activa'`;

    const params = [];

    if(usuario.tipo !== 'admin'){
        where += `
            AND p.id_usuario = ?
        `;
        params.push(usuario.id);
    }

    if (idTema) {

        where += `
            AND p.id_tema = ?
        `;

        params.push(idTema);

    }

    const [[{ total }]] =
        await pool.query(
            `
            SELECT
                COUNT(*) AS total
            FROM pregunta p
            ${where}
            `,
            params
        );

    const [items] =
        await pool.query(
            `
            SELECT
                p.id_pregunta,
                p.enunciado,
                p.estado_pregunta,
                t.id_tema,
                t.nome_tema,
                u.nome AS autor
            FROM pregunta p
            INNER JOIN tema t
                ON p.id_tema = t.id_tema
            LEFT JOIN usuario u
                ON p.id_usuario = u.id_usuario
            ${where}
            LIMIT ?
            OFFSET ?
            `,
            [
                ...params,
                Number(limit),
                offset
            ]
        );

    return {
        items,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(
            total / limit
        )
    };

};

const findPreguntaById = async (id, usuario) => {
    /*INNER JOIN tema Para obtener: nome_tema
    LEFT JOIN usuario Porque: una pregunta oficial puede no tener usuario
    o ser creada por admin y LEFT JOIN da más flexibilidad */
    const [rows] = await pool.query(`
        SELECT
            p.id_pregunta,
            p.enunciado,
            p.estado_pregunta,
            p.id_tema,
            t.nome_tema,
            p.id_usuario,
            u.nome AS autor
        FROM pregunta p
        INNER JOIN tema t
            ON p.id_tema = t.id_tema
        LEFT JOIN usuario u
            ON p.id_usuario = u.id_usuario
        WHERE p.id_pregunta = ?
        AND p.id_usuario= ?
        AND p.estado_pregunta = 'activa'
    `, [id, usuario.id]);

    return rows[0];

};

// el testController mezcla las preguntas. Es redundante?
const findPreguntasAleatorias = async (
    idTema,
    cantidad,
    soloAdmin = false
) => {

    let sql = `
        SELECT p.id_pregunta
        FROM pregunta p
        INNER JOIN usuario u
        ON p.id_usuario = u.id_usuario
        WHERE p.estado_pregunta = 'activa'
        AND p.id_tema = ?
    `;

    if (soloAdmin) {
        sql += `
            AND u.tipo = 'admin'
        `;
    }

    sql += `
        ORDER BY RAND()
        LIMIT ?
    `;

    const [rows] = await pool.query(
        sql,
        [
            idTema,
            Number(cantidad)
        ]
    );

    return rows;

};

/*
const insertPregunta = async (
    enunciado,
    id_tema,
    id_usuario
) => {

    const [result] = await pool.query(`
        INSERT INTO pregunta (
            enunciado,
            id_tema,
            id_usuario
        )
        VALUES (?, ?, ?)
    `, [
        enunciado,
        id_tema,
        id_usuario
    ]);

    return result.insertId;

};
*/
const updatePreguntaById = async (
    id,
    enunciado,
    id_tema,
    usuario
) => {

    const [result] = await pool.query(`
        UPDATE pregunta
        SET
            enunciado = ?,
            id_tema = ?
        WHERE id_pregunta = ?
        AND id_usuario= ?
        AND estado_pregunta = 'activa'
    `, [
        enunciado,
        id_tema,
        id,
        usuario.id
    ]);

    return result;

};


const crearPreguntaCompleta = async (
    enunciado,
    id_tema,
    id_usuario,
    opciones
) => {
    
    if (!Array.isArray(opciones) || opciones.length < 2) {

        throw new Error(
            'A pregunta debe ter polo menos dúas opcións.'
        );

    }

    const correctas =
        opciones.filter(
            opcion => opcion.e_correcta
        );

    if (correctas.length !== 1) {

        throw new Error(
            'Debe existir unha única resposta correcta.'
        );

    }

    const connection =
        await pool.getConnection();

    try {

        await connection.beginTransaction();

        const [pregunta] =
            await connection.query(`
                INSERT INTO pregunta(
                    enunciado,
                    id_tema,
                    id_usuario
                )
                VALUES(?,?,?)
            `,[
                enunciado,
                id_tema,
                id_usuario
            ]);

        const id_pregunta =
            pregunta.insertId;

       for (const opcion of opciones) {

            if (!opcion.texto?.trim()) {

                throw new Error(
                    'Todas as opcións deben ter texto.'
                );

            }

            await connection.query(`
                INSERT INTO opcion(
                    id_pregunta,
                    letra_opcion,
                    texto,
                    e_correcta
                )
                VALUES(?,?,?,?)
            `,[
                id_pregunta,
                opcion.letra_opcion,
                opcion.texto,
                opcion.e_correcta
            ]);

        }

        await connection.commit();

        return id_pregunta;

    } catch(error){

        await connection.rollback();

        throw error;

    } finally{

        connection.release();

    }

};

const deletePreguntaById = async (id, usuario) => {

    const [result] = await pool.query(`
        UPDATE pregunta
        SET estado_pregunta = 'eliminada'
        WHERE id_pregunta = ?
        AND id_usuario= ?
        AND estado_pregunta = 'activa'
    `, [id, usuario.id]);

    return result;

};

const contarPreguntasUsuario = async (id_usuario) => {

    const [[result]] = await pool.query(`
        SELECT COUNT(*) AS total
        FROM pregunta
        WHERE id_usuario = ?
        AND estado_pregunta = 'activa'
    `, [id_usuario]);

    return result.total;

};

module.exports = {
    findAllPreguntas,
    findPreguntaById,
    findPreguntasAleatorias,
    crearPreguntaCompleta,
    updatePreguntaById,
    deletePreguntaById,
    contarPreguntasUsuario
};