# Backend — Consulta de Empresas

API Node.js responsible por validar CNPJs, consultar a BrasilAPI e disponibilizar os dados para o frontend.

O backend é a única camada que acessa a BrasilAPI. O frontend consome a API própria em `/api/empresas/:cnpj`.

---

## Responsabilidades

- receber consultas de CNPJ;
- remover caracteres não numéricos;
- validar o CNPJ no servidor, independentemente do frontend;
- consultar a BrasilAPI com timeout de 10 segundos;
- traduzir falhas externas para respostas HTTP consistentes;
- controlar as origens permitidas pelo CORS;
- disponibilizar um health check;
- esconder detalhes internos de erros em produção;
- disponibilizar testes automatizados com Node Test Runner e Supertest.

---

## Tecnologias

- Node.js;
- Express 5;
- Axios;
- CORS;
- dotenv;
- Nodemon em desenvolvimento;
- Node Test Runner;
- Supertest;
- Git e GitHub.

---

## Pré-requisitos

- Node.js `20.19+` ou `22.12+`;
- npm `10+`;
- acesso à internet para consultas reais à BrasilAPI;
- frontend em `http://localhost:5173` quando a integração for testada localmente.

O projeto foi validado com Node.js 24 e npm 11.

Se necessário, instale o Node.js com nvm:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 24
nvm use 24
```

---

## Clonando a branch backend

A branch `backend` deve ser clonada em uma pasta própria:

```bash
git clone --branch backend --single-branch https://github.com/Fbgg2k/Consulta-Empresas-.git consulta-empresas-backend
cd consulta-empresas-backend
```

O código da API está na raiz dessa branch.

---

## Executando localmente

### Instalar dependências

```bash
npm ci
```

### Configurar o `.env`

```bash
cp .env.example .env
```

No Windows:

```bat
copy .env.example .env
```

### Iniciar em desenvolvimento

```bash
npm run dev
```

O servidor utilize a porta `3001` por padrão:

```text
http://localhost:3001
```

Para executar sem Nodemon:

```bash
npm start
```

---

## Configuração

O arquivo `.env` deve conter:

```env
PORT=3001
BRASIL_API_URL=https://brasilapi.com.br/api/cnpj/v1
FRONTEND_URL=http://localhost:5173
```

### Variáveis

- `PORT`: porta HTTP do servidor;
- `BRASIL_API_URL`: URL base da BrasilAPI;
- `FRONTEND_URL`: origem autorizada pelo CORS. Várias URLs podem ser separadas por vírgula.

O arquivo `.env` não deve ser enviado ao Git. O arquivo `.env.example` é a referência versionada.

Se `FRONTEND_URL` não for informada, o backend permite `http://localhost:5173` por padrão.

---

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

Teste com curl:

```bash
curl http://localhost:3001/health
```

### Consultar empresa

```http
GET /api/empresas/:cnpj
```

O parâmetro pode estar com ou sem máscara. O backend normaliza o valor antes de validar e consultar a BrasilAPI.

Exemplo com CNPJ sem máscara:

```bash
curl http://localhost:3001/api/empresas/27865757000102
```

Resposta `200 OK`:

```json
{
  "empresa": {
    "cnpj": "27865757000102",
    "razao_social": "Empresa Exemplo LTDA",
    "nome_fantasia": "Empresa Exemplo",
    "descricao_situacao_cadastral": "ATIVA",
    "cnae_fiscal": 6200101,
    "cnae_fiscal_descricao": "Desenvolvimento de programas de computador",
    "data_inicio_atividade": "2020-01-01",
    "logradouro": "Rua Exemplo",
    "numero": "100",
    "bairro": "Centro",
    "municipio": "São Paulo",
    "uf": "SP",
    "cep": "01001-000"
  }
}
```

A BrasilAPI pode retornar campos adicionais. O backend repassa a resposta dentro da propriedade `empresa`.

---

## Fluxo da requisição

```text
Frontend
   │
   │ GET /api/empresas/:cnpj
   ▼
Controller
   │
   ├── normaliza o CNPJ
   ├── valida os dígitos verificadores
   │
   ▼
BrasilApiService
   │
   │ GET BRASIL_API_URL/:cnpj
   ▼
BrasilAPI
   │
   ▼
Controller
   │
   ▼
JSON { empresa } ou erro padronizado
```

---

## Validação do CNPJ

A validação é feita no backend mesmo que o frontend já tenha validado o valor.

A rotina:

1. remove tudo que não for número;
2. exige exatamente 14 dígitos;
3. rejeita CNPJs com todos os dígitos iguais;
4. calcula o primeiro dígito verificador;
5. calcula o segundo dígito verificador;
6. compara os dígitos calculados com os informados.

Ela está em:

```text
src/utils/cnpj.js
```

---

## Tratamento de erros

Todas as respostas de erro seguem o formato:

```json
{
  "error": {
    "code": "INVALID_CNPJ",
    "message": "CNPJ inválido. Informe um CNPJ válido."
  }
}
```

| Status | Código | Situação |
| --- | --- | --- |
| `400` | `INVALID_CNPJ` | CNPJ ausente, incompleto ou inválido |
| `404` | `COMPANY_NOT_FOUND` | Empresa não encontrada na BrasilAPI |
| `404` | `ROUTE_NOT_FOUND` | Rota inexistente |
| `502` | `BRASILAPI_ERROR` | Resposta inesperada da BrasilAPI |
| `503` | `BRASILAPI_UNAVAILABLE` | Timeout ou falha de comunicação |
| `500` | `INTERNAL_ERROR` | Erro interno não previsto |

O service de integração traduz:

- `404` da BrasilAPI para `COMPANY_NOT_FOUND`;
- timeout ou erro de rede para `BRASILAPI_UNAVAILABLE`;
- outros erros externos para `BRASILAPI_ERROR`.

Em `NODE_ENV=production`, mensagens internas de erros `500` não são expostas.

---

## CORS

O backend permite por padrão:

```text
http://localhost:5173
```

Para permitir mais de uma origem:

```env
FRONTEND_URL=http://localhost:5173,http://localhost:4173
```

O CORS é configurado em `src/app.js`.

---

## Organização do código

```text
.
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
├── package.json
└── README.md
```

### Responsabilidade dos arquivos

- `server.js`: inicia o servidor HTTP;
- `src/app.js`: configura Express, CORS, JSON, rotas e middlewares;
- `src/routes/empresaRoutes.js`: define `GET /api/empresas/:cnpj`;
- `src/controllers/empresaController.js`: valida a entrada e coordena a resposta;
- `src/services/brasilApiService.js`: consome a BrasilAPI com Axios;
- `src/utils/cnpj.js`: normaliza e valida CNPJs;
- `src/middlewares/errorHandler.js`: trata rotas inexistentes e erros;
- `tests/`: testes de unidade e integração.

---

## Testes automatizados

Execute:

```bash
npm test
```

A suíte cobre:

- health check;
- CNPJ válido;
- CNPJ inválido;
- resposta de sucesso;
- empresa inexistente;
- normalização dos dados;
- tratamento de erros.

Os testes de integração substituem a URL da BrasilAPI por um servidor HTTP local, evitando dependência da BrasilAPI durante a execução da suíte.

Resultado validado:

```text
6 testes aprovados
0 falhas
```

---

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor com Nodemon |
| `npm start` | Inicia o servidor com Node.js |
| `npm test` | Executa os testes automatizados |

---

## Segurança e boas práticas

- a BrasilAPI é chamada somente pelo backend;
- o `.env` não deve ser versionado;
- o backend não armazena CNPJs ou dados pessoais;
- não há autenticação nesta primeira versão;
- CORS é configurado por ambiente;
- mensagens de erro externas são padronizadas;
- a API externa possui timeout de 10 segundos;
- o header `x-powered-by` é desabilitado.

---

## Decisões técnicas

- Node.js e Express foram escolhidos para uma API simples e fácil de executar;
- Axios facilita o controle de timeout e erros HTTP;
- dotenv mantém a configuração fora do código;
- a BrasilAPI é isolada no service;
- controllers, rotas, services e middlewares mantêm responsabilidades separadas;
- o CNPJ é validado novamente no servidor para proteger a API;
- não há banco de dados porque o escopo não exige persistência;
- o histórico é responsabilidade do frontend e permanece no `localStorage`.

---

## Integração com o frontend

Execute o backend em:

```text
http://localhost:3001
```

E o frontend em:

```text
http://localhost:5173
```

O frontend envia a requisição:

```http
GET /api/empresas/27865757000102
```

O backend deve estar disponível antes de a consulta ser realizada.

---

## Solução de problemas

### `EADDRINUSE`

A porta `3001` já está sendo utilizada. Encerre o processo anterior ou altere `PORT` no `.env`.

### `BRASILAPI_UNAVAILABLE`

Verifique a conexão com a internet e a URL:

```env
BRASIL_API_URL=https://brasilapi.com.br/api/cnpj/v1
```

### CORS bloqueado

Confirme que a URL usada pelo frontend está em `FRONTEND_URL`:

```env
FRONTEND_URL=http://localhost:5173
```

### Executar testes sem depender da BrasilAPI

Os testes usam um servidor HTTP local para simular respostas. Portanto, não é necessário configurar uma chave ou token para executar `npm test`.

---

## Documentação relacionada

- README principal: branch `main`;
- escopo do projeto: `Escopo completo — Teste Técnico Estagiário Fullstack.md`;
- documentação do frontend: branch `frontend`, arquivo `README.md`.

---

## Melhorias futuras

- cache de respostas;
- banco de dados para histórico;
- autenticação e histórico por usuário;
- deploy do backend;
- observabilidade e logs estruturados;
- testes end-to-end;
- rate limiting;
- documentação OpenAPI/Swagger.
