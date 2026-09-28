// db.js - persistência simples em arquivo JSON (sem dependências nativas).
// RNF01: garante histórico completo (nunca apaga fisicamente roteiro/roteiro_ponto).
const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "data", "db.json");

function seed() {
  return {
    nextId: { motoristas: 7, gerentes: 3, pontos: 11, roteiros: 13, auditoria: 1 },
    motoristas: [
      { id: 1, nome: "Carlos Souza", telefone: "31 99999-0001", documento: "MG1234567", veiculo: "Honda CG 160", kmPorLitro: 35 },
      { id: 2, nome: "Renata Alves", telefone: "31 98888-1122", documento: "MG7654321", veiculo: "Yamaha Fazer 250", kmPorLitro: 28 },
      { id: 3, nome: "Marcos Vinícius", telefone: "31 97777-4455", documento: "MG9988776", veiculo: "Honda Biz 125", kmPorLitro: 42 },
      { id: 4, nome: "Juliana Mendes", telefone: "31 96666-5544", documento: "MG3322110", veiculo: "Fiat Uno", kmPorLitro: 14 },
      { id: 5, nome: "Roberto Ferreira", telefone: "31 95555-8899", documento: "MG1122334", veiculo: "Honda CG 160", kmPorLitro: 35 },
      { id: 6, nome: "Fernanda Costa", telefone: "31 94444-7766", documento: "MG5566778", veiculo: "Yamaha NMAX", kmPorLitro: 38 }
    ],
    gerentes: [
      { id: 1, nome: "Ana Lima", telefone: "31 98888-0002", email: "ana@empresa.com" },
      { id: 2, nome: "Bruno Teixeira", telefone: "31 99222-3344", email: "bruno@empresa.com" }
    ],
    pontos: [
      { id: 1, endereco: "Base Operacional (partida)", latitude: null, longitude: null },
      { id: 2, endereco: "Rua Peru, 55", latitude: null, longitude: null },
      { id: 3, endereco: "Rua X, 5", latitude: null, longitude: null },
      { id: 4, endereco: "Av. João César, 100", latitude: null, longitude: null },
      { id: 5, endereco: "Rua das Palmeiras, 210", latitude: null, longitude: null },
      { id: 6, endereco: "Av. Cristiano Machado, 4200", latitude: null, longitude: null },
      { id: 7, endereco: "Praça da Savassi, 10", latitude: null, longitude: null },
      { id: 8, endereco: "Rua da Bahia, 1148", latitude: null, longitude: null },
      { id: 9, endereco: "Av. Afonso Pena, 1500", latitude: null, longitude: null },
      { id: 10, endereco: "Av. Amazonas, 200", latitude: null, longitude: null }
    ],
    parametro: { valorCombustivel: 6.10, custoPorKm: 0.85, jornadaPadraoHoras: 8, vigenteDesde: "2026-01-01" },
    roteiros: [
      // --- Dia 20 ---
      {
        id: 1, data: "2026-09-20", motoristaId: 1, gerenteId: 1, distanciaTotalKm: 14,
        pontos: [
          { ordem: 1, pontoId: 1, chegada: "2026-09-20T08:00", saida: "2026-09-20T08:00" },
          { ordem: 2, pontoId: 2, chegada: "2026-09-20T08:20", saida: "2026-09-20T08:35" },
          { ordem: 3, pontoId: 3, chegada: "2026-09-20T09:00", saida: "2026-09-20T09:10" },
          { ordem: 4, pontoId: 4, chegada: "2026-09-20T09:40", saida: "2026-09-20T10:30" }
        ]
      },
      {
        id: 2, data: "2026-09-20", motoristaId: 2, gerenteId: 1, distanciaTotalKm: 22,
        pontos: [
          { ordem: 1, pontoId: 1, chegada: "2026-09-20T08:30", saida: "2026-09-20T08:30" },
          { ordem: 2, pontoId: 7, chegada: "2026-09-20T09:15", saida: "2026-09-20T09:45" },
          { ordem: 3, pontoId: 8, chegada: "2026-09-20T10:10", saida: "2026-09-20T10:30" }
        ]
      },
      // --- Dia 21 ---
      {
        id: 3, data: "2026-09-21", motoristaId: 1, gerenteId: 1, distanciaTotalKm: 9,
        pontos: [
          { ordem: 1, pontoId: 1, chegada: "2026-09-21T08:00", saida: "2026-09-21T08:00" },
          { ordem: 2, pontoId: 2, chegada: "2026-09-21T08:15", saida: "2026-09-21T08:25" },
          { ordem: 3, pontoId: 3, chegada: "2026-09-21T08:50", saida: "2026-09-21T09:00" }
        ]
      },
      {
        id: 4, data: "2026-09-21", motoristaId: 4, gerenteId: 2, distanciaTotalKm: 34,
        pontos: [
          { ordem: 1, pontoId: 1, chegada: "2026-09-21T07:00", saida: "2026-09-21T07:00" },
          { ordem: 2, pontoId: 6, chegada: "2026-09-21T07:45", saida: "2026-09-21T08:40" },
          { ordem: 3, pontoId: 9, chegada: "2026-09-21T09:20", saida: "2026-09-21T09:50" },
          { ordem: 4, pontoId: 10, chegada: "2026-09-21T10:10", saida: "2026-09-21T11:00" }
        ]
      },
      // --- Dia 22 ---
      {
        id: 5, data: "2026-09-22", motoristaId: 2, gerenteId: 2, distanciaTotalKm: 17,
        pontos: [
          { ordem: 1, pontoId: 1, chegada: "2026-09-22T07:30", saida: "2026-09-22T07:30" },
          { ordem: 2, pontoId: 5, chegada: "2026-09-22T07:55", saida: "2026-09-22T08:20" },
          { ordem: 3, pontoId: 6, chegada: "2026-09-22T08:45", saida: "2026-09-22T09:05" }
        ]
      },
      {
        id: 6, data: "2026-09-22", motoristaId: 5, gerenteId: 1, distanciaTotalKm: 11,
        pontos: [
          { ordem: 1, pontoId: 1, chegada: "2026-09-22T08:00", saida: "2026-09-22T08:00" },
          { ordem: 2, pontoId: 8, chegada: "2026-09-22T08:20", saida: "2026-09-22T08:50" },
          { ordem: 3, pontoId: 2, chegada: "2026-09-22T09:10", saida: "2026-09-22T09:20" }
        ]
      },
      {
        id: 7, data: "2026-09-22", motoristaId: 3, gerenteId: 2, distanciaTotalKm: 28,
        pontos: [
          { ordem: 1, pontoId: 1, chegada: "2026-09-22T13:00", saida: "2026-09-22T13:00" },
          { ordem: 2, pontoId: 10, chegada: "2026-09-22T13:40", saida: "2026-09-22T14:30" },
          { ordem: 3, pontoId: 4, chegada: "2026-09-22T15:10", saida: "2026-09-22T15:25" }
        ]
      },
      // --- Dia 23 ---
      {
        id: 8, data: "2026-09-23", motoristaId: 3, gerenteId: 1, distanciaTotalKm: 13,
        pontos: [
          { ordem: 1, pontoId: 1, chegada: "2026-09-23T09:00", saida: "2026-09-23T09:00" },
          { ordem: 2, pontoId: 2, chegada: "2026-09-23T09:20", saida: "2026-09-23T09:30" },
          { ordem: 3, pontoId: 6, chegada: "2026-09-23T10:00", saida: "2026-09-23T10:50" }
        ]
      },
      {
        id: 9, data: "2026-09-23", motoristaId: 6, gerenteId: 1, distanciaTotalKm: 19,
        pontos: [
          { ordem: 1, pontoId: 1, chegada: "2026-09-23T08:00", saida: "2026-09-23T08:00" },
          { ordem: 2, pontoId: 9, chegada: "2026-09-23T08:45", saida: "2026-09-23T09:30" },
          { ordem: 3, pontoId: 7, chegada: "2026-09-23T09:45", saida: "2026-09-23T10:00" }
        ]
      },
      // --- Dia 24 ---
      {
        id: 10, data: "2026-09-24", motoristaId: 1, gerenteId: 2, distanciaTotalKm: 21,
        pontos: [
          { ordem: 1, pontoId: 1, chegada: "2026-09-24T07:30", saida: "2026-09-24T07:30" },
          { ordem: 2, pontoId: 10, chegada: "2026-09-24T08:15", saida: "2026-09-24T09:00" },
          { ordem: 3, pontoId: 6, chegada: "2026-09-24T09:45", saida: "2026-09-24T10:15" }
        ]
      },
      {
        id: 11, data: "2026-09-24", motoristaId: 4, gerenteId: 1, distanciaTotalKm: 15,
        pontos: [
          { ordem: 1, pontoId: 1, chegada: "2026-09-24T08:00", saida: "2026-09-24T08:00" },
          { ordem: 2, pontoId: 5, chegada: "2026-09-24T08:30", saida: "2026-09-24T09:10" },
          { ordem: 3, pontoId: 8, chegada: "2026-09-24T09:25", saida: "2026-09-24T09:50" }
        ]
      },
      {
        id: 12, data: "2026-09-24", motoristaId: 6, gerenteId: 2, distanciaTotalKm: 8,
        pontos: [
          { ordem: 1, pontoId: 1, chegada: "2026-09-24T14:00", saida: "2026-09-24T14:00" },
          { ordem: 2, pontoId: 2, chegada: "2026-09-24T14:15", saida: "2026-09-24T14:45" },
          { ordem: 3, pontoId: 3, chegada: "2026-09-24T15:00", saida: "2026-09-24T15:20" }
        ]
      }
    ],
    auditoria: []
  };
}

function load() {
  if (!fs.existsSync(DB_FILE)) {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    const initial = seed();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

function save(state) {
  fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2));
}

let state = load();

function nextId(table) {
  const id = state.nextId[table];
  state.nextId[table] = id + 1;
  return id;
}

// RNF05: auditoria das alterações em pontos e horários
function registrarAuditoria(tabela, registroId, operacao, valorAnterior, valorNovo) {
  state.auditoria.push({
    id: nextId("auditoria"), tabela, registroId, operacao,
    dataHora: new Date().toISOString(), valorAnterior, valorNovo
  });
}

module.exports = { state, save, nextId, registrarAuditoria };