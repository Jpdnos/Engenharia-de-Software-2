# Nome do projeto: CronoPonto

Slogan : *Cada minuto parado, no seu controle.*

Sistema de Monitoramento de Tempo Parado em Roteiros — Engenharia de Software II
(prof. Sandro Laudares).

API REST em Node.js/Express (pasta `javascript/`) que implementa as regras de negócio
(RN01–RN07) e persiste os dados em `javascript/data/db.json`. O front-end (pasta `html/`)
já está conectado à API por `fetch`.

## Estrutura de pastas

```
diagramas/     → diagramas do projeto preliminar
html/          → mvp-CronoPonto.html (front-end)
javascript/    → server.js, db_2.js e o backend
```

## Como rodar

Só precisa do [Node.js](https://nodejs.org) instalado.

1. Abra o terminal **dentro da pasta `javascript/`** (é onde ficam o `server.js` e o
   `package.json`):
   ```bash
   cd javascript
   ```

2. Instale as dependências (só na primeira vez, cria a pasta `node_modules`):
   ```bash
   npm install
   ```

3. Suba o servidor:
   ```bash
   npm start
   ```

4. Quando aparecer `Backend rodando com sucesso!`, abra no navegador:
   ```
   http://localhost:3001
   ```
   O próprio backend já serve o `mvp-CronoPonto.html`, não precisa abrir o arquivo
   direto nem usar Live Server.

Para parar o servidor, `Ctrl+C` no terminal. Se aparecer "porta em uso", troque a porta:
```bash
# Windows (PowerShell)
$env:PORT=3002; npm start
# Mac/Linux
PORT=3002 npm start
```
Nesse caso, ajuste também a constante `API` no topo do `mvp-CronoPonto.html`.

## Banco de dados

Os dados ficam em `javascript/data/db.json` (ou `javascript/db.json`, conforme o
`db_2.js` em uso), criado automaticamente com dados de exemplo na primeira execução.
Para reiniciar o sistema do zero, feche o servidor e apague esse arquivo.

## Endpoints principais

| Método | Rota | Descrição |
|---|---|---|
| GET/POST | `/api/motoristas` | listar / cadastrar motorista |
| GET/POST | `/api/gerentes` | listar / cadastrar gerente |
| GET/POST | `/api/pontos` | listar / cadastrar ponto |
| GET/PUT | `/api/parametros` | ver / atualizar combustível, custo por km e jornada |
| GET/POST | `/api/roteiros` | listar (com tempo parado e custo já calculados) / criar roteiro |
| PUT | `/api/roteiros/:id/pontos/:ordem` | registrar chegada/saída de um ponto |
| GET | `/api/health` | verificação de saúde da API |

Os recortes do dashboard (dia, mês e período) e o histórico filtrado por endereço são
calculados no front-end a partir de `GET /api/roteiros`.

## Perfis de acesso

A tela de login oferece três perfis (RNF04): motorista/motoboy, gerente/coordenador e
administrador. O motorista vê só o próprio roteiro do dia e registra chegada/saída; o
gerente e o admin veem o dashboard completo, cadastros e parâmetros.