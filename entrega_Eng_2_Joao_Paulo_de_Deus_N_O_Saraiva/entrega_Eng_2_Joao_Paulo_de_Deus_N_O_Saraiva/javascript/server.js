const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db_2.js"); // O arquivo de banco de dados fornecido

const app = express();
const fs = require("fs");
// aceita a pasta ../html ou o HTML na mesma pasta do server.js
const htmlDir = fs.existsSync(path.join(__dirname, "..", "html", "mvp-CronoPonto.html"))
  ? path.join(__dirname, "..", "html") : __dirname;

app.use(cors());
app.use(express.json());
app.use(express.static(htmlDir, { etag: false, setHeaders: res => res.setHeader("Cache-Control", "no-store") }));

app.get("/", (req, res) => {
  res.sendFile(path.join(htmlDir, "mvp-CronoPonto.html"));
});

// Verificação de saúde da API (usada no boot do frontend)
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// ==========================================
// CADASTROS (Motoristas, Gerentes e Pontos)
// ==========================================

app.get("/api/motoristas", (req, res) => res.json(db.state.motoristas));
app.post("/api/motoristas", (req, res) => {
  const { nome, telefone, documento, veiculo, kmPorLitro } = req.body;
  if (!nome || !String(nome).trim()) return res.status(400).json({ erro: "Nome é obrigatório" });
  const novo = { id: db.nextId("motoristas"), nome, telefone, documento, veiculo, kmPorLitro };
  db.state.motoristas.push(novo);
  db.save(db.state);
  res.status(201).json(novo);
});

app.get("/api/gerentes", (req, res) => res.json(db.state.gerentes));
app.post("/api/gerentes", (req, res) => {
  const { nome, telefone, email } = req.body;
  if (!nome || !String(nome).trim()) return res.status(400).json({ erro: "Nome é obrigatório" });
  const novo = { id: db.nextId("gerentes"), nome, telefone, email };
  db.state.gerentes.push(novo);
  db.save(db.state);
  res.status(201).json(novo);
});

app.get("/api/pontos", (req, res) => res.json(db.state.pontos));
app.post("/api/pontos", (req, res) => {
  const { endereco } = req.body;
  if (!endereco || !String(endereco).trim()) return res.status(400).json({ erro: "Endereço é obrigatório" });
  const novo = { id: db.nextId("pontos"), endereco, latitude: null, longitude: null };
  db.state.pontos.push(novo);
  db.save(db.state);
  res.status(201).json(novo);
});

// ==========================================
// PARÂMETROS DE JORNADA E CUSTO
// ==========================================

app.get("/api/parametros", (req, res) => res.json(db.state.parametro));
app.put("/api/parametros", (req, res) => {
  const { valorCombustivel, custoPorKm, jornadaPadraoHoras } = req.body;
  const ok = v => typeof v === "number" && isFinite(v) && v > 0;
  if (ok(valorCombustivel)) db.state.parametro.valorCombustivel = valorCombustivel;
  if (ok(custoPorKm)) db.state.parametro.custoPorKm = custoPorKm;
  if (ok(jornadaPadraoHoras)) db.state.parametro.jornadaPadraoHoras = jornadaPadraoHoras;
  db.save(db.state);
  res.json(db.state.parametro);
});

// ==========================================
// ROTEIROS E TEMPO PARADO
// ==========================================

app.get("/api/roteiros", (req, res) => {
  // Retorna os roteiros injetando cálculos dinâmicos de tempo e custo (RN07)
  const roteirosProcessados = db.state.roteiros.map(r => {
    const motorista = db.state.motoristas.find(m => m.id === r.motoristaId);
    const kml = motorista ? motorista.kmPorLitro : 10;
    const param = db.state.parametro;
    
    // RN07: custo = (distância / kmL) * valorCombustível
    const custoEstimado = (r.distanciaTotalKm / kml) * param.valorCombustivel;

    let tempoTotalParadoMin = 0;
    const pontosCalculados = r.pontos.map(p => {
      let tempoParadoMin = null;
      // o ponto de partida (ordem 1) não conta como tempo parado
      if (p.ordem > 1 && p.chegada && p.saida) {
        const t1 = new Date(p.chegada);
        const t2 = new Date(p.saida);
        tempoParadoMin = Math.max(0, Math.round((t2 - t1) / 60000));
        tempoTotalParadoMin += tempoParadoMin;
      }
      return { ...p, tempoParadoMin };
    });

    return { ...r, pontos: pontosCalculados, custoEstimado, tempoTotalParadoMin };
  });
  
  res.json(roteirosProcessados);
});

app.post("/api/roteiros", (req, res) => {
  const { data, motoristaId, distanciaTotalKm, pontos } = req.body;
  if (!db.state.motoristas.some(m => m.id === Number(motoristaId)))
    return res.status(400).json({ erro: "Motorista inválido" });
  if (!Array.isArray(pontos) || pontos.length < 2)
    return res.status(400).json({ erro: "Roteiro precisa de ao menos 2 pontos" });
  if (!pontos.every(p => db.state.pontos.some(x => x.id === Number(p.pontoId))))
    return res.status(400).json({ erro: "Ponto inexistente no roteiro" });
  const novoRoteiro = {
    id: db.nextId("roteiros"),
    data,
    motoristaId,
    gerenteId: 1, // Atribuição simplificada no MVP
    distanciaTotalKm,
    pontos: pontos.map(p => ({
      ordem: p.ordem,
      pontoId: p.pontoId,
      chegada: null,
      saida: null
    }))
  };
  db.state.roteiros.push(novoRoteiro);
  db.save(db.state);
  res.status(201).json(novoRoteiro);
});

app.put("/api/roteiros/:id/pontos/:ordem", (req, res) => {
  const id = parseInt(req.params.id);
  const ordem = parseInt(req.params.ordem);
  const { chegada, saida } = req.body;

  const roteiro = db.state.roteiros.find(r => r.id === id);
  if (!roteiro) return res.status(404).json({ erro: "Roteiro não encontrado" });

  const ponto = roteiro.pontos.find(p => p.ordem === ordem);
  if (!ponto) return res.status(404).json({ erro: "Ponto não encontrado" });

  if (saida && !(chegada || ponto.chegada))
    return res.status(400).json({ erro: "Registre a chegada antes da saída" });
  const chegadaFinal = ponto.chegada || chegada;
  if (saida && chegadaFinal && new Date(saida) < new Date(chegadaFinal))
    return res.status(400).json({ erro: "Saída não pode ser anterior à chegada" });

  // RNF05: Auditoria de alterações de horário
  if (chegada && !ponto.chegada) {
    db.registrarAuditoria("roteiro_ponto", id, "REGISTRO_CHEGADA", null, chegada);
    ponto.chegada = chegada;
  }
  if (saida && !ponto.saida) {
    db.registrarAuditoria("roteiro_ponto", id, "REGISTRO_SAIDA", null, saida);
    ponto.saida = saida;
  }

  db.save(db.state);
  res.json(ponto);
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Backend rodando com sucesso! Acesse o frontend via navegador enquanto a API responde em http://localhost:${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`Porta ${PORT} já está em uso. Feche o processo anterior ou use outra porta com PORT=xxxx.`);
    process.exit(1);
  }
  console.error("Erro ao iniciar o servidor:", err);
  process.exit(1);
});