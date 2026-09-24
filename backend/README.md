# Backend - Consulta de Empresas

API Node.js responsavel por validar CNPJs, consultar a BrasilAPI e disponibilizar os dados para o frontend.

## Responsabilidades

- Receber consultas no endpoint `/api/empresas/:cnpj`;
- Validar o CNPJ no servidor, independentemente da validacao do frontend;
- Consultar a BrasilAPI com timeout de 10 segundos;
- Traduzir falhas externas para respostas HTTP consistentes;
- Controlar as origens permitidas por CORS;
- Disponibilizar um health check para verificar se o servico esta ativo.

## Tecnologias

- Node.js;
- Express 5;
- Axios;
- CORS;
- dotenv;
- Supertest e Node Test Runner para testes;
- Nodemon para desenvolvimento.

## Pre-requisitos

- Node.js 18 ou superior;
- npm;
- Acesso de rede para a BrasilAPI, exceto durante os testes automatizados.

## Instalacao e execucao

Na raiz do repositorio:

```bash
cd backend
npm install
npm run dev
```

O servidor inicia por padrao em `http://localhost:3001`.
Para executar sem o Nodemon:

```bash
npm start
```

## Configuracao

Crie um arquivo `.env` dentro desta pasta quando precisar alterar os valores padrao:

```env
PORT=3001
BRASIL_API_URL=https://brasilapi.com.br/api/cnpj/v1
FRONTEND_URL=http://localhost:5173
```

`FRONTEND_URL` pode receber varias origens separadas por virgula. Quando nao informado,
o backend permite `http://localhost:5173`.

O arquivo `.env` nao deve ser versionado. Em producao, defina as variaveis no ambiente de execucao.

## Scripts disponiveis

| Comando | Descricao |
| --- | --- |
| `npm run dev` | Inicia o servidor com reinicio automatico usando Nodemon |
| `npm start` | Inicia o servidor em modo normal |
| `npm test` | Executa os testes automatizados |

## Endpoints

### Health check

```http
GET /health
```

Resposta `200 OK`:

```json
{
  "status": "ok"
}
```

### Consulta de empresa

```http
GET /api/empresas/:cnpj
```

O parametro pode conter pontuacao, pois o backend remove caracteres nao numericos antes da validacao.
Exemplo:

```bash
curl http://localhost:3001/api/empresas/27865757000102
```

Resposta `200 OK`:

```json
{
  "empresa": {
    "razao_social": "Empresa Exemplo LTDA",
    "nome_fantasia": "Empresa Exemplo",
    "descricao_situacao_cadastral": "ATIVA"
  }
}
```

Os demais campos sao repassados conforme retornados pela BrasilAPI, incluindo dados de CNAE,
datas e endereco.

## Tratamento de erros

Todas as falhas da API usam o formato:

```json
{
  "error": {
    "code": "CODIGO_DO_ERRO",
    "message": "Mensagem explicando o problema."
  }
}
```

| Status | Codigo | Situacao |
| --- | --- | --- |
| `400` | `INVALID_CNPJ` | CNPJ ausente, com quantidade incorreta de digitos ou digitos verificadores invalidos |
| `404` | `COMPANY_NOT_FOUND` | A BrasilAPI nao encontrou a empresa |
| `404` | `ROUTE_NOT_FOUND` | Rota solicitada nao existe |
| `502` | `BRASILAPI_ERROR` | A BrasilAPI respondeu com erro |
| `503` | `BRASILAPI_UNAVAILABLE` | Timeout ou falha de comunicacao com a BrasilAPI |
| `500` | `INTERNAL_ERROR` | Erro interno nao previsto |

Em `NODE_ENV=production`, erros internos com status 500 nao expoem a mensagem original.

## Organizacao do codigo

```text
src/
├── controllers/       Entrada HTTP e orquestracao da consulta
├── errors/            Classe de erros de aplicacao
├── middlewares/       CORS, rota inexistente e tratamento de erros
├── routes/            Definicao das rotas HTTP
├── services/          Integracao com a BrasilAPI
├── utils/             Normalizacao e validacao do CNPJ
└── app.js             Configuracao do Express

server.js              Inicializacao do servidor HTTP
tests/                 Testes da API e dos cenarios de erro
```

O service usa a URL configurada em `BRASIL_API_URL` e possui timeout de 10 segundos.
Os testes substituem essa URL por um servidor HTTP local para nao depender da BrasilAPI real.

## Testes

```bash
npm test
```

Os testes cobrem o health check, CNPJ invalido, resposta de sucesso e empresa inexistente.

## Fluxo da aplicacao

```text
Frontend
   -> GET /api/empresas/:cnpj
Express
   -> valida e normaliza o CNPJ
Service
   -> GET BrasilAPI /api/cnpj/v1/:cnpj
Backend
   -> devolve { empresa } ou um erro padronizado
```

O backend nao possui banco de dados: o historico das consultas e uma responsabilidade do frontend,
mantida localmente no navegador.
