# Consulta de Empresas

Aplicação web fullstack para consultar informações públicas de uma empresa através do CNPJ, utilizando a [BrasilAPI](https://brasilapi.com.br/).

## Tecnologias

### Frontend

- React
- Vite
- JavaScript
- CSS responsivo
- Fetch API

### Backend

- Node.js
- Express
- Axios
- Cors
- dotenv
- Nodemon em desenvolvimento

## Funcionalidades

- Consulta de empresas por CNPJ;
- Máscara e validação dos dígitos verificadores no frontend e no backend;
- Integração indireta com a BrasilAPI através de uma API própria;
- Exibição de razão social, nome fantasia, situação cadastral, CNAE, data de abertura e endereço;
- Estados de carregamento, sucesso e erro;
- Histórico das últimas cinco consultas com `localStorage`;
- Opção de repetir uma consulta a partir do histórico;
- Interface responsiva para desktop, tablet e mobile;
- Tratamento de erros com mensagens amigáveis;
- Endpoint de health check em `/health`.

## Requisitos

- Node.js 20.19+ ou 22.12+;
- npm 10+;
- Git para versionamento;
- acesso à internet para consultar a BrasilAPI.

O projeto foi validado com Node.js 24 e npm 11.

Se o Node.js ainda não estiver instalado, uma opção sem alterar pacotes do sistema é usar o nvm:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 24
nvm use 24
```

No Linux Mint/Ubuntu, o Git pode ser instalado com:

```bash
sudo apt update
sudo apt install git
```

## Estrutura

```text
consulta-empresas/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── errors/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── .gitignore
└── README.md
```

## Instalação

Clone o repositório e acesse a pasta do projeto:

```bash
git clone URL_DO_REPOSITORIO
cd consulta-empresas
```

### Frontend

Em um terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend ficará disponível em `http://localhost:5173`.

### Backend

Em outro terminal:

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

O backend ficará disponível em `http://localhost:3001`.

> No Windows, o comando para criar o arquivo local pode ser `copy .env.example .env`.

## Variáveis de ambiente

### Backend

O arquivo `backend/.env` deve conter:

```env
PORT=3001
BRASIL_API_URL=https://brasilapi.com.br/api/cnpj/v1
FRONTEND_URL=http://localhost:5173
```

- `PORT`: porta usada pelo servidor;
- `BRASIL_API_URL`: endereço base da BrasilAPI;
- `FRONTEND_URL`: origem autorizada pelo CORS. múltiplas URLs podem ser separadas por vírgula.

O arquivo `.env` não deve ser enviado ao Git. O arquivo `.env.example` é a versão segura para documentar as variáveis.

### Frontend

O arquivo `frontend/.env` pode ser criado com:

```env
VITE_API_URL=http://localhost:3001
```

Se não for definido, o frontend usará `http://localhost:3001` como padrão durante o desenvolvimento.

## API

### Consultar empresa

```http
GET /api/empresas/:cnpj
```

Exemplo:

```bash
curl http://localhost:3001/api/empresas/27865757000102
```

O backend normaliza e valida o CNPJ antes de consultar a BrasilAPI. Uma resposta de sucesso possui o formato:

```json
{
  "empresa": {
    "razao_social": "...",
    "nome_fantasia": "...",
    "situacao_cadastral": "ATIVA"
  }
}
```

### Health check

```http
GET /health
```

## Tratamento de erros

| Status | Código | Situação |
| --- | --- | --- |
| `400` | `INVALID_CNPJ` | CNPJ inválido |
| `404` | `COMPANY_NOT_FOUND` | Empresa não encontrada na BrasilAPI |
| `404` | `ROUTE_NOT_FOUND` | Rota inexistente no backend |
| `502` | `BRASILAPI_ERROR` | Resposta inesperada da BrasilAPI |
| `503` | `BRASILAPI_UNAVAILABLE` | BrasilAPI indisponível ou timeout |

Formato de erro:

```json
{
  "error": {
    "code": "INVALID_CNPJ",
    "message": "CNPJ inválido. Informe um CNPJ válido."
  }
}
```

## Histórico

As consultas bem-sucedidas são armazenadas no navegador com a chave `historicoCnpj`. O histórico:

- mantém apenas os cinco CNPJs mais recentes;
- remove duplicatas;
- atualiza a posição de um CNPJ quando ele é consultado novamente;
- permite iniciar uma nova consulta ao clicar em um item.

## Scripts

Frontend:

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

Backend:

```bash
npm run dev
npm start
npm test
```

## Decisões técnicas

- O frontend consome a API própria para manter a BrasilAPI fora do navegador e centralizar validação e tratamento de erros.
- O CNPJ é validado no frontend para melhorar a experiência e no backend para garantir a segurança da API.
- A primeira versão não utiliza banco de dados, conforme o escopo.
- O histórico é local ao navegador porque não há autenticação nem dados sensíveis.
- A organização separa controllers, rotas, serviços, utilitários e middlewares no backend; no frontend, separa componentes, páginas, serviços e utilitários.

## Melhorias futuras

- testes automatizados com Vitest e Supertest;
- cache de respostas;
- banco de dados para histórico persistente;
- autenticação e histórico por usuário;
- deploy do backend e do frontend;
- paginação ou filtros adicionais.
