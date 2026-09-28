# ParaRota — Backend

API REST em Node.js/Express que implementa as regras de negócio (RN01–RN07) e a
persistência (arquivo `data/db.json`, criado automaticamente na primeira execução).

## Como rodar

Precisa do [Node.js](https://nodejs.org) instalado (não precisa de Live Server nem de
nenhuma ferramenta de front-end — é um processo de servidor separado).

```bash
npm install
npm start
```

A API sobe em `http://localhost:3001`.

## Endpoints principais

| Método | Rota | Descrição |
|---|---|---|
| GET/POST | `/api/motoristas` | listar / cadastrar motorista |
| GET/POST | `/api/gerentes` | listar / cadastrar gerente |
| GET/POST | `/api/pontos` | listar / cadastrar ponto |
| GET/PUT | `/api/parametros` | ver / atualizar custo e jornada |
| GET/POST | `/api/roteiros` | listar (com tempo parado e custo já calculados) / criar roteiro |
| PUT | `/api/roteiros/:id/pontos/:ordem` | registrar chegada/saída de um ponto do roteiro |
| GET | `/api/dashboard?agrupamento=dia\|mes\|periodo&inicio=&fim=` | indicadores agregados |

## Front-end

O protótipo publicado (Projeto de Interface e Interação) hoje guarda os dados só em
memória no navegador. Para ligá-lo a este backend, troque as funções `render*`/`salvar*`
por chamadas `fetch("http://localhost:3001/api/...")` — o CORS já está liberado.
