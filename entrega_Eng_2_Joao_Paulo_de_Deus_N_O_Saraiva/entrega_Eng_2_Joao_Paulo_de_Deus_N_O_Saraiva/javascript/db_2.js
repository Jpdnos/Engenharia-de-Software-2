const fs = require('fs');
const path = require('path');

const dbFile = path.join(__dirname, 'db.json');

const defaultState = {
  motoristas: [
    { id: 1, nome: "Carlos Souza", telefone: "31999999999", documento: "11122233344", veiculo: "Fiat Fiorino - ABC1234", kmPorLitro: 12 }
  ],
  gerentes: [
    { id: 1, nome: "Gerente Principal", telefone: "31988888888", email: "gerencia@pararota.com" }
  ],
  pontos: [
    { id: 1, endereco: "Centro de Distribuição", latitude: -19.4658, longitude: -44.2467 },
    { id: 2, endereco: "Cliente A - R. Principal", latitude: -19.4700, longitude: -44.2500 }
  ],
  roteiros: [],
  parametro: {
    valorCombustivel: 5.89,
    custoPorKm: 0.65,
    jornadaPadraoHoras: 8
  },
  auditoria: []
};

function load() {
  if (fs.existsSync(dbFile)) {
    const data = fs.readFileSync(dbFile, 'utf-8');
    return JSON.parse(data);
  }
  fs.writeFileSync(dbFile, JSON.stringify(defaultState, null, 2), 'utf-8');
  return defaultState;
}

const state = load();

function saveState(newState) {
  // escrita atômica: evita db.json corrompido se o processo cair no meio da gravação
  const tmp = dbFile + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(newState, null, 2), 'utf-8');
  fs.renameSync(tmp, dbFile);
}

module.exports = {
  state,
  save: () => saveState(state),
  nextId: (collectionName) => {
    const collection = state[collectionName];
    if (!collection || collection.length === 0) return 1;
    return Math.max(...collection.map(item => item.id)) + 1;
  },
  registrarAuditoria: (entidade, entidadeId, acao, valorAntigo, valorNovo) => {
    state.auditoria.push({
      id: module.exports.nextId("auditoria"),
      entidade,
      entidadeId,
      acao,
      valorAntigo,
      valorNovo,
      dataHora: new Date().toISOString()
    });
    saveState(state);
  }
};