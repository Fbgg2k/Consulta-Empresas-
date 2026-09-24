# Consulta de Empresas

Aplicação web fullstack para consultar informações públicas de uma empresa pelo CNPJ, usando a [BrasilAPI](https://brasilapi.com.br/).

O usuário informa um CNPJ, o frontend chama uma API própria, o backend valida e normaliza o valor, consulta a BrasilAPI e retorna os dados cadastrais para exibição na interface.

---

## Funcionalidades implementadas

- Consulta de empresas por CNPJ;
- Máscara no formato `00.000.000/0000-00`;
- Validação dos dígitos verificadores no frontend e no backend;
- Integração com a BrasilAPI através do backend;
- Exibição de razão social, nome fantasia e situação cadastral;
- Exibição de CNAE principal e data de abertura;
- Exibição de endereço completo;
- Estado de carregamento durante a consulta;
- Tratamento de CNPJ inválido;
- Tratamento de empresa inexistente;
- Tratamento de falha de comunicação com a BrasilAPI;
- Histórico das últimas cinco consultas;
- Reconsulta a partir do histórico;
- Interface responsiva para desktop, tablet e mobile;
- Endpoint de health check;
- Testes automatizados do backend;
- Testes automatizados do frontend;
- Documentação de instalação e execução;
- Uso de Git e GitHub.

---

## Arquitetura

```text
Usuário
   │
   ▼
Frontend React + Vite
   │
   │ GET /api/empresas/:cnpj
   ▼
Backend Node.js + Express
   │
   │ GET /api/cnpj/v1/:cnpj
   ▼
BrasilAPI
```

O frontend **não acessa a BrasilAPI diretamente**. Toda chamada externa passa pelo backend, que concentra validação, configuração da URL da BrasilAPI e tratamento de erros.

---

## Organização das branches

O repositório está organizado em três branches independentes:

| Branch | Conteúdo | Uso |
| --- | --- | --- |
| `main` | README, escopo e PDF | Documentação do projeto |
| `frontend` | Aplicação React + Vite na raiz da branch | Interface e testes do frontend |
| `backend` | API Node.js + Express na raiz da branch | API, validações e testes do backend |

A `main` não possui a aplicação executável. Para rodar o projeto, clone as branches `frontend` e `backend` em pastas separadas.

---

## Tecnologias

### Frontend

- React 19;
- Vite 8;
- JavaScript;
- CSS responsivo;
- Fetch API;
- Vitest;
- Testing Library;
- jsdom;
- Oxlint.

### Backend

- Node.js;
- Express 5;
- Axios;
- CORS;
- dotenv;
- Nodemon;
- Supertest;
- Node Test Runner.

### Versionamento

- Git;
- GitHub;
- branches `main`, `frontend` e `backend`.

---

## Pré-requisitos

- Git;
- Node.js `20.19+` ou `22.12+`;
- npm `10+`;
- acesso à internet para consultar a BrasilAPI.

O projeto foi validado com Node.js 24 e npm 11.

### Instalando o Node.js com nvm

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 24
nvm use 24
```

Verifique as versões:

```bash
node --version
npm --version
```

No Linux Mint/Ubuntu, o Git pode ser instalado com:

```bash
sudo apt update
sudo apt install git
```

---

## Clonando as três branches

A opção mais simples é clonar cada branch em uma pasta diferente. Isso permite executar frontend e backend ao mesmo tempo.

### 1. Branch `main`

```bash
git clone --branch main --single-branch https://github.com/Fbgg2k/Consulta-Empresas-.git consulta-empresas-main
cd consulta-empresas-main
```

A pasta `main` contém principalmente:

```text
README.md
Escopo completo — Teste Técnico Estagiário Fullstack.md
teste-tecnico-estagiario-fullstack.pdf
```

### 2. Branch `frontend`

Abra outro terminal ou volte ao diretório pai:

```bash
cd ..
git clone --branch frontend --single-branch https://github.com/Fbgg2k/Consulta-Empresas-.git consulta-empresas-frontend
cd consulta-empresas-frontend
```

### 3. Branch `backend`

Abra outro terminal:

```bash
cd ..
git clone --branch backend --single-branch https://github.com/Fbgg2k/Consulta-Empresas-.git consulta-empresas-backend
cd consulta-empresas-backend
```

A estrutura final locals fica semelhante a:

```text
parent/
├── consulta-empresas-main/
├── consulta-empresas-frontend/
└── consulta-empresas-backend/
```

### Alternativa: um clone e três worktrees

Se preferir usar apenas um clone:

```bash
git clone https://github.com/Fbgg2k/Consulta-Empresas-.git consulta-empresas
cd consulta-empresas
git fetch origin
git switch main
git worktree add ../consulta-empresas-frontend origin/frontend
git worktree add ../consulta-empresas-backend origin/backend
```

---

## Executando o backend

No terminal da pasta `consulta-empresas-backend`:

```bash
cd consulta-empresas-backend
cp .env.example .env
npm ci
npm run dev
```

O backend ficará disponível em:

```text
http://localhost:3001
```

Para executar sem Nodemon:

```bash
npm start
```

Verifique o health check:

```bash
curl http://localhost:3001/health
```

Resposta esperada:

```json
{
  "status": "ok"
}
```

---

## Executando o frontend

No terminal da pasta `consulta-empresas-frontend`:

```bash
cd consulta-empresas-frontend
npm ci
npm run dev
```

O frontend ficará disponível em:

```text
http://localhost:5173
```

Abra essa URL no navegador. O frontend usa `http://localhost:3001` como URL padrão da API.

Para expor o Vite em uma rede local:

```bash
npm run dev -- --host 0.0.0.0
```

Os dois servidores precisam ser executados simultaneamente para realizar uma consulta completa.

---

## Variáveis de ambiente

### Backend

Crie o arquivo local:

```bash
cp .env.example .env
```

Conteúdo esperado:

```env
PORT=3001
BRASIL_API_URL=https://brasilapi.com.br/api/cnpj/v1
FRONTEND_URL=http://localhost:5173
```

- `PORT`: porta do servidor;
- `BRASIL_API_URL`: endereço base da BrasilAPI;
- `FRONTEND_URL`: origem autorizada pelo CORS; múltiplas URLs podem ser separadas por vírgula.

O arquivo `.env` não deve ser versionado. O arquivo `.env.example` deve ser mantido no Git.

No Windows, use:

```bat
copy .env.example .env
```

### Frontend

O frontend funciona sem arquivo `.env` porque usa `http://localhost:3001` como padrão. Para configurar outro backend:

```bash
cp .env.example .env
```

Conteúdo:

```env
VITE_API_URL=http://localhost:3001
```

Reinicie o Vite depois de alterar a variável.

---

## API do backend

### Consultar empresa

```http
GET /api/empresas/:cnpj
```

Exemplo:

```bash
curl http://localhost:3001/api/empresas/27865757000102
```

O backend aceita o CNPJ com ou sem máscara, remove caracteres não numéricos e valida os dígitos verificadores antes de chamar a BrasilAPI.

Resposta de sucesso:

```json
{
  "empresa": {
    "razao_social": "Empresa Exemplo LTDA",
    "nome_fantasia": "Empresa Exemplo",
    "descricao_situacao_cadastral": "ATIVA",
    "cnae_fiscal": 6200101,
    "data_inicio_atividade": "2020-01-01",
    "logradouro": "Rua Exemplo",
    "numero": "100",
    "bairro": "Centro",
    "municipio": "São Paulo",
    "uf": "SP"
  }
}
```

### Health check

```http
GET /health
```

---

## Tratamento de erros

| Status | Código | Situação |
| --- | --- | --- |
| `400` | `INVALID_CNPJ` | CNPJ ausente, incompleto ou inválido |
| `404` | `COMPANY_NOT_FOUND` | Empresa não encontrada na BrasilAPI |
| `404` | `ROUTE_NOT_FOUND` | Rota inexistente |
| `502` | `BRASILAPI_ERROR` | Resposta inesperada da BrasilAPI |
| `503` | `BRASILAPI_UNAVAILABLE` | Timeout ou falha de comunicação |
| `500` | `INTERNAL_ERROR` | Erro interno não previsto |

Formato padrão de erro:

```json
{
  "error": {
    "code": "INVALID_CNPJ",
    "message": "CNPJ inválido. Informe um CNPJ válido."
  }
}
```

---

## Histórico de consultas

O frontend armazena as consultas bem-sucedidas no `localStorage`, usando a chave:

```text
historicoCnpj
```

Características:

- máximo de cinco registros;
- item mais recente no início;
- duplicatas são removidas;
- consultar novamente um CNPJ reposiciona o item;
- é possível clicar em um registro para repetir a busca;
- nenhuma informação pessoal é armazenada.

---

## Testes e qualidade

### Frontend

```bash
cd consulta-empresas-frontend
npm test
npm run lint
npm run build
```

A suíte do frontend cobre:

- máscara e validação de CNPJ;
- histórico e limite de cinco registros;
- remoção de duplicatas;
- validação antes da chamada à API;
- loading;
- exibição dos dados;
- mensagens de erro.

Resultado validado:

```text
3 arquivos de teste
9 testes aprovados
0 falhas
0 erros de lint
build de produção aprovado
```

### Backend

```bash
cd consulta-empresas-backend
npm test
```

Os testes cobrem:

- health check;
- CNPJ válido;
- CNPJ inválido;
- resposta de sucesso;
- empresa inexistente;
- falhas simuladas da API.

Resultado validado:

```text
6 testes aprovados
0 falhas
```

---

## Estrutura da branch `frontend`

```text
consulta-empresas-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── CompanyCard.jsx
│   │   ├── ErrorMessage.jsx
│   │   ├── Header.jsx
│   │   ├── Loading.jsx
│   │   ├── SearchForm.jsx
│   │   └── SearchHistory.jsx
│   ├── pages/
│   │   └── Home.jsx
│   ├── services/
│   │   └── api.js
│   ├── test/
│   │   └── setup.js
│   ├── utils/
│   │   ├── cnpj.js
│   │   └── storage.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── src/pages/Home.test.jsx
├── src/utils/cnpj.test.js
├── src/utils/storage.test.js
├── vitest.config.js
├── .env.example
├── .gitignore
└── package.json
```

## Estrutura da branch `backend`

```text
consulta-empresas-backend/
├── src/
│   ├── controllers/
│   │   └── empresaController.js
│   ├── errors/
│   │   └── AppError.js
│   ├── middlewares/
│   │   └── errorHandler.js
│   ├── routes/
│   │   └── empresaRoutes.js
│   ├── services/
│   │   └── brasilApiService.js
│   ├── utils/
│   │   └── cnpj.js
│   └── app.js
├── tests/
│   ├── cnpj.test.js
│   └── empresa.test.js
├── server.js
├── .env.example
├── .gitignore
└── package.json
```

---

## Decisões técnicas

- O frontend usa uma API própria para não expor a chamada direta à BrasilAPI;
- a validação é feita nos dois lados para melhorar a experiência e proteger o backend;
- o histórico usa `localStorage` porque a primeira versão não possui autenticação nem banco de dados;
- o backend separa controllers, rotas, services, utilitários e middlewares;
- o frontend separa componentes, páginas, serviços e utilitários;
- a primeira versão não utiliza banco de dados;
- não há autenticação nem armazenamento de dados sensíveis.

---

## Funcionalidades futuras

- cache de respostas da BrasilAPI;
- banco de dados para histórico persistente;
- autenticação e histórico por usuário;
- deploy do backend e do frontend;
- testes end-to-end;
- novos filtros e paginação.

---

## Documentação complementar

- Escopo do teste: `Escopo completo — Teste Técnico Estagiário Fullstack.md`;
- PDF do escopo: `teste-tecnico-estagiario-fullstack.pdf`;
- Documentação específica do frontend: branch `frontend`, arquivo `README.md`;
- Documentação específica do backend: branch `backend`, arquivo `README.md`.

---

## Checklist de validação

A seção de critérios de aceite e a ordem de desenvolvimento foram atualizadas no escopo. O projeto foi validado com:

- consulta real na BrasilAPI;
- loading;
- CNPJ inválido;
- empresa inexistente;
- falha da BrasilAPI;
- histórico;
- desktop;
- mobile;
- lint;
- build;
- testes do frontend;
- testes do backend.
