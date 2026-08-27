const examenes = {
  // id oposicion 2:
  2: {
    nome: "Administrativo Xunta",
    duracion: 120 * 60,
    totalPreguntas: 120,
    temas: [
      { orden: 1, id_tema: 1, nome: "Tema 1 - CE", min: 8, max: 12 },
      { orden: 2, id_tema: 8, nome: "Estatuto Autonomía", min: 6, max: 10 },
      { orden: 3, id_tema: 9, nome: "UE - Fontes do Dereito", min: 15, max: 24},
      { orden: 4, id_tema: 10, nome: "Lei 31/1995", min: 4, max: 5 },
      { orden: 5, id_tema: 2, nome: "Lei 39/2015", min: 13, max: 18 },
      { orden: 6, id_tema: 3, nome: "Lei 40/2015", min: 8, max: 10 },
      { orden: 7, id_tema: 11, nome: "Lei 16/2010", min: 8, max: 11 },
      { orden: 8, id_tema: 12, nome: "Lei 9/2017", min: 10, max: 16 },
      { orden: 9, id_tema: 13, nome: "Lei 9/2007", min: 4, max: 6 },
      { orden: 10, id_tema: 4, nome: "Lei 2/2015", min: 12, max: 15 },
      { orden: 11, id_tema: 14, nome: "DL 1/1999", min: 6, max: 10 },
      { orden: 12, id_tema: 5, nome: "RDL 1/2013", min: 4, max: 6 },
      { orden: 13, id_tema: 6, nome: "Lei 1/2016", min: 5, max: 6 },
      { orden: 14, id_tema: 7, nome: "DL 2/2015", min: 3, max: 5 },
      { orden: 15, id_tema: 15, nome: "RDL 2/2015 (ET)", min: 4, max: 6 },
      { orden: 16, id_tema: 16, nome: "RDL 8/2015", min: 2, max: 4 },
    ],
  },

  // id oposicion 3:
  3: {
    nome: "Auxiliar Administrativo Xunta C2",
    duracion: 120 * 60,
    totalPreguntas: 80,
    temas: [
      { orden: 1, id_tema: 1, nome: "Tema 1 - CE", min: 5, max: 13 },
      { orden: 2, id_tema: 8, nome: "Estatuto Autonomía", min: 5, max: 6 },
      { orden: 3, id_tema: 9, nome: "UE - Fontes do Dereito", min: 5, max: 6 },
      { orden: 4, id_tema: 10, nome: "Lei 31/1995", min: 4, max: 5 },
      { orden: 5, id_tema: 11, nome: "Lei 16/2010", min: 6, max: 9 },
      { orden: 6, id_tema: 2, nome: "Lei 39/2015", min: 11, max: 15 },
      { orden: 7, id_tema: 3, nome: "Lei 40/2015", min: 5, max: 10 },
      { orden: 8, id_tema: 14, nome: "DL 1/1999", min: 4, max: 6 },
      { orden: 9, id_tema: 6, nome: "Lei 1/2016", min: 5, max: 8 },
      { orden: 10, id_tema: 4, nome: "Lei 2/2015", min: 10, max: 19 },
      { orden: 11, id_tema: 7, nome: "DL 2/2015", min: 3, max: 5 },
      { orden: 12, id_tema: 5, nome: "RDL 1/2013", min: 3, max: 5 },
    ],
  },
};

function obterConfiguracionExame(idOposicion) {
  return examenes[idOposicion] || null;
}

module.exports = {
  obterConfiguracionExame,
};
