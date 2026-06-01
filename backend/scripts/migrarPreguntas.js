const sqlite3 = require('sqlite3').verbose();
const mysql = require('mysql2/promise');

const sqliteDb = new sqlite3.Database(
    'C:/ruta/database.sqlite'
);

const TEMAS_EXCLUIDOS = [
    'Plantilla'
];

const esTemaValido = (nombre) => {

    return !(
        nombre.startsWith('C1_') ||
        nombre.startsWith('C2_') ||
        nombre.startsWith('AP_') ||
        nombre.startsWith('Plantilla')
    );

};

const getAll = (sql) => {

    return new Promise((resolve, reject) => {

        sqliteDb.all(
            sql,
            [],
            (err, rows) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }

            }
        );

    });

};

(async () => {

    const mysqlConn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'TU_PASSWORD',
        database: 'apto_db'
    });

    console.log('Migrando temas...');

    const temas = await getAll(`
        SELECT *
        FROM temas
    `);

    const mapaTemas = {};

    for (const tema of temas) {

        if (!esTemaValido(tema.nombre)) {
            continue;
        }

        const [result] = await mysqlConn.execute(
            `
            INSERT INTO tema
            (
                nome_tema,
                estado_tema
            )
            VALUES (?, 'activo')
            `,
            [tema.nombre]
        );

        mapaTemas[tema.id] = result.insertId;

    }

    console.log(
        'Temas migrados:',
        Object.keys(mapaTemas).length
    );

    console.log('Leyendo relaciones pregunta_tema...');

    const relaciones = await getAll(`
        SELECT *
        FROM pregunta_tema
    `);

    const mapaPreguntaTema = {};

    for (const r of relaciones) {

        if (!mapaTemas[r.tema_id]) {
            continue;
        }

        if (!mapaPreguntaTema[r.pregunta_id]) {

            mapaPreguntaTema[r.pregunta_id] =
                mapaTemas[r.tema_id];

        }

    }

    console.log('Migrando preguntas...');

    const preguntas = await getAll(`
        SELECT *
        FROM preguntas
    `);

    let preguntasMigradas = 0;

    for (const pregunta of preguntas) {

        const idTema =
            mapaPreguntaTema[pregunta.id];

        if (!idTema) {
            continue;
        }

        const [preguntaResult] =
            await mysqlConn.execute(
                `
                INSERT INTO pregunta
                (
                    enunciado,
                    id_tema,
                    estado_pregunta
                )
                VALUES
                (
                    ?,
                    ?,
                    'activa'
                )
                `,
                [
                    pregunta.enunciado,
                    idTema
                ]
            );

        const idPreguntaNueva =
            preguntaResult.insertId;

        const opciones =
            JSON.parse(
                pregunta.opciones
            );

        const letras =
            ['A', 'B', 'C', 'D'];

        for (
            let i = 0;
            i < opciones.length;
            i++
        ) {

            await mysqlConn.execute(
                `
                INSERT INTO opcion
                (
                    id_pregunta,
                    letra_opcion,
                    texto,
                    e_correcta
                )
                VALUES
                (
                    ?,
                    ?,
                    ?,
                    ?
                )
                `,
                [
                    idPreguntaNueva,
                    letras[i],
                    opciones[i],
                    opciones[i] ===
                    pregunta.respuesta_correcta
                ]
            );

        }

        preguntasMigradas++;

    }

    console.log(
        'Preguntas migradas:',
        preguntasMigradas
    );

    await mysqlConn.end();

    sqliteDb.close();

    console.log('Migración finalizada');

})().catch(console.error);