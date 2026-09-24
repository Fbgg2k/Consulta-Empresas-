# Escopo do Projeto — Consulta de Empresas

## 1. Identificação

**Projeto:** Consulta de Empresas  
**Tipo:** Teste Técnico — Estagiário(a) de Desenvolvimento Fullstack  
**Objetivo:** Desenvolver uma aplicação web capaz de consultar informações públicas de uma empresa utilizando seu CNPJ, através da BrasilAPI.

---

# 2. Objetivo geral

Construir uma aplicação web fullstack que permita ao usuário informar um CNPJ e consultar os dados públicos da empresa.

A aplicação deverá possuir:

- Interface web responsiva;
- Campo para consulta de CNPJ;
- Validação do CNPJ;
- Backend próprio;
- Integração do backend com a BrasilAPI;
- Exibição dos dados da empresa;
- Estados de carregamento;
- Tratamento de erros;
- Histórico das últimas 5 consultas;
- Código organizado;
- Documentação para execução do projeto.

---

# 3. API externa

A aplicação utilizará a **BrasilAPI — Consulta de CNPJ**.

### Endpoint

```text
GET https://brasilapi.com.br/api/cnpj/v1/{cnpj}
```

### Exemplo

```text
GET https://brasilapi.com.br/api/cnpj/v1/27865757000102
```

A aplicação não deverá realizar a chamada da BrasilAPI diretamente pelo frontend.

O fluxo será:

```text
Usuário
   │
   ▼
Frontend React
   │
   │ GET /api/empresas/:cnpj
   ▼
Backend Node.js + Express
   │
   │ GET BrasilAPI
   ▼
BrasilAPI
   │
   ▼
Backend trata os dados
   │
   ▼
Frontend recebe resposta
   │
   ▼
Exibição dos dados
```

---

# 4. Stack tecnológica

## 4.1 Frontend

### React

Utilizar React para construção da interface.

### Vite

Utilizar Vite para criação e execução do projeto frontend.

### JavaScript

Linguagem principal do projeto.

### CSS

Utilizar CSS para estilização e responsividade.

Opcionalmente poderá ser utilizado:

```text
Tailwind CSS
```

Entretanto, CSS convencional é suficiente para o desafio.

---

# 4.2 Backend

### Node.js

Runtime utilizado para execução do servidor.

### Express

Framework utilizado para criação da API própria.

### Axios ou Fetch

Responsável pelo consumo da BrasilAPI.

Sugestão:

```text
Axios
```

por facilitar o tratamento das requisições e erros.

---

# 4.3 Banco de dados

## Primeira versão

Não será utilizado banco de dados.

O histórico das consultas será mantido no navegador através de:

```text
localStorage
```

Isso atende ao requisito de manter as últimas 5 consultas durante a sessão/uso da aplicação.

## Possível evolução

Caso haja tempo adicional, poderá ser implementado:

```text
SQLite
```

ou

```text
PostgreSQL
```

Entretanto, essa funcionalidade será considerada opcional.

---

# 4.4 Testes

Como diferencial, poderão ser utilizados:

```text
Vitest
Supertest
```

### Testes sugeridos

- Validação de CNPJ;
- Endpoint de consulta;
- CNPJ inválido;
- Empresa não encontrada;
- Falha da BrasilAPI;
- Resposta de sucesso.

Os testes não devem comprometer a entrega principal caso o tempo seja limitado.

---

# 5. Arquitetura do projeto

A aplicação será dividida em duas partes:

```text
consulta-empresas/
│
├── frontend/
│
└── backend/
```

---

# 6. Estrutura do frontend

Sugestão:

```text
frontend/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── SearchForm.jsx
│   │   ├── CompanyCard.jsx
│   │   ├── Loading.jsx
│   │   ├── ErrorMessage.jsx
│   │   └── SearchHistory.jsx
│   │
│   ├── pages/
│   │   └── Home.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── utils/
│   │   ├── cnpj.js
│   │   └── storage.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
└── vite.config.js
```

---

# 7. Estrutura do backend

```text
backend/
│
├── src/
│   │
│   ├── controllers/
│   │   └── empresaController.js
│   │
│   ├── routes/
│   │   └── empresaRoutes.js
│   │
│   ├── services/
│   │   └── brasilApiService.js
│   │
│   ├── utils/
│   │   └── cnpj.js
│   │
│   ├── middlewares/
│   │   └── errorHandler.js
│   │
│   └── app.js
│
├── tests/
│
├── server.js
├── package.json
├── .env
└── .env.example
```

---

# 8. Frontend — estrutura visual

A aplicação poderá utilizar uma estrutura simples e profissional.

## Cabeçalho

Criar um `Header` contendo:

```text
┌──────────────────────────────────────────────┐
│  Consulta de Empresas          Início        │
└──────────────────────────────────────────────┘
```

Como o projeto possui apenas uma funcionalidade principal, **não é necessário criar várias páginas apenas para criar navegação**.

A recomendação é:

```text
Header
   │
   └── Início
```

Caso seja criada uma segunda página posteriormente, poderá ser adicionada:

```text
Início | Histórico
```

Porém, para o escopo original, uma página única é suficiente.

---

# 9. Página principal

A página inicial deverá conter:

```text
┌─────────────────────────────────────────────┐
│               CONSULTA DE EMPRESAS         │
│                                             │
│ Consulte informações públicas de empresas   │
│ através do CNPJ                             │
│                                             │
│ CNPJ                                        │
│ ┌──────────────────────────────┐            │
│ │ 00.000.000/0000-00           │ [Consultar]│
│ └──────────────────────────────┘            │
│                                             │
└─────────────────────────────────────────────┘
```

Após a consulta:

```text
┌─────────────────────────────────────────────┐
│ DADOS DA EMPRESA                            │
│                                             │
│ Razão Social: Empresa Exemplo LTDA          │
│ Nome Fantasia: Empresa Exemplo              │
│ Situação: ATIVA                             │
│ CNAE: 0000-0/00                             │
│ Data de abertura: 01/01/2020                │
│                                             │
│ Endereço                                    │
│ Rua Exemplo, 100                            │
│ Centro - Município/UF                       │
└─────────────────────────────────────────────┘
```

---

# 10. Componentes do frontend

## Header

Responsável pelo cabeçalho da aplicação.

Responsabilidades:

- Exibir nome/logo do sistema;
- Disponibilizar navegação;
- Adaptar-se ao mobile.

---

## SearchForm

Responsável pela consulta.

Deve possuir:

- Input de CNPJ;
- Máscara;
- Botão consultar;
- Validação;
- Estado de carregamento.

---

## CompanyCard

Responsável pela apresentação dos dados da empresa.

Campos:

- Razão social;
- Nome fantasia;
- Situação cadastral;
- CNAE principal;
- Data de abertura;
- Logradouro;
- Número;
- Bairro;
- Município;
- UF.

---

## Loading

Exibir enquanto a API estiver sendo consultada.

Exemplo:

```text
Consultando empresa...
```

---

## ErrorMessage

Exibir mensagens amigáveis para erros.

Exemplos:

```text
CNPJ inválido. Informe um CNPJ com 14 dígitos.
```

```text
Empresa não encontrada.
```

```text
Não foi possível consultar a BrasilAPI.
Tente novamente mais tarde.
```

---

## SearchHistory

Responsável pelo histórico das últimas 5 consultas.

Exemplo:

```text
Últimas consultas

1. 27.865.757/0001-02
2. 12.345.678/0001-90
3. 98.765.432/0001-10
```

Ao realizar uma sexta consulta, a mais antiga deverá ser removida.

---

# 11. Backend — API própria

O frontend deverá consumir a API desenvolvida no backend.

## Endpoint principal

```http
GET /api/empresas/:cnpj
```

Exemplo:

```http
GET /api/empresas/27865757000102
```

---

# 12. Fluxo da requisição

## 1. Usuário informa o CNPJ

```text
27.865.757/0001-02
```

## 2. Frontend remove caracteres

```text
27865757000102
```

## 3. Frontend chama o backend

```http
GET /api/empresas/27865757000102
```

## 4. Backend valida o CNPJ

Se inválido:

```http
400 Bad Request
```

## 5. Backend consulta a BrasilAPI

```http
GET https://brasilapi.com.br/api/cnpj/v1/27865757000102
```

## 6. Backend processa a resposta

## 7. Backend retorna os dados ao frontend

## 8. Frontend exibe os dados

---

# 13. Tratamento de erros

## CNPJ inválido

Frontend:

```text
CNPJ inválido.
Informe um CNPJ com 14 dígitos.
```

Backend:

```http
400 Bad Request
```

---

## Empresa não encontrada

Backend:

```http
404 Not Found
```

Frontend:

```text
Empresa não encontrada.
Verifique o CNPJ informado.
```

---

## Erro da BrasilAPI

Backend:

```http
502 Bad Gateway
```

ou

```http
503 Service Unavailable
```

Frontend:

```text
Não foi possível consultar a empresa no momento.
Tente novamente mais tarde.
```

---

# 14. Validação do CNPJ

A validação deverá ocorrer em dois níveis.

## Frontend

Antes de enviar:

```text
14 dígitos numéricos
```

Exemplo válido de formato:

```text
27865757000102
```

ou formatado:

```text
27.865.757/0001-02
```

## Backend

O backend também deverá validar a entrada.

Isso é obrigatório para evitar depender exclusivamente da validação do navegador.

---

# 15. Máscara do CNPJ

O campo poderá apresentar:

```text
00.000.000/0000-00
```

Enquanto o backend receberá:

```text
00000000000000
```

A máscara será apenas uma preocupação de apresentação.

---

# 16. Histórico

O frontend deverá manter as últimas 5 consultas.

Sugestão:

```javascript
localStorage
```

Chave:

```text
historicoCnpj
```

Formato:

```json
[
  "27865757000102",
  "12345678000190",
  "98765432000110"
]
```

Regra:

```text
Máximo = 5 registros
```

Ao inserir o sexto:

```text
Remove o mais antigo
Adiciona o novo
```

Também deverá ser possível clicar em uma consulta do histórico para realizar novamente a consulta.

---

# 17. Responsividade

A interface deverá funcionar em:

### Desktop

```text
1366px+
```

### Tablet

```text
768px+
```

### Mobile

```text
320px+
```

No mobile:

- Header adaptado;
- Input ocupando a largura disponível;
- Botão abaixo ou ao lado do campo;
- Card da empresa em uma coluna;
- Histórico adaptado para tela pequena.

---

# 18. Estados da aplicação

A aplicação deverá considerar pelo menos os seguintes estados:

```text
IDLE
 │
 ├── Usuário ainda não consultou
 │
 ▼
LOADING
 │
 ├── Consulta em andamento
 │
 ▼
SUCCESS
 │
 └── Dados encontrados
 │
 ├── ERROR
 │
 ├── CNPJ inválido
 ├── Empresa não encontrada
 └── Erro de comunicação
```

---

# 19. Segurança e boas práticas

Não armazenar informações sensíveis.

Não haverá senha ou autenticação.

A URL da BrasilAPI deverá ser configurada no backend.

Sugestão:

```env
BRASIL_API_URL=https://brasilapi.com.br/api/cnpj/v1
PORT=3001
```

Arquivo:

```text
.env
```

Não deverá ser enviado ao GitHub.

Criar:

```text
.env.example
```

Exemplo:

```env
BRASIL_API_URL=https://brasilapi.com.br/api/cnpj/v1
PORT=3001
```

---

# 20. CORS

Como frontend e backend serão executados separadamente durante o desenvolvimento:

```text
Frontend: http://localhost:5173
Backend: http://localhost:3001
```

O backend deverá permitir requisições do frontend.

Pacote:

```text
cors
```

---

# 21. Variáveis de ambiente

Backend:

```env
PORT=3001
BRASIL_API_URL=https://brasilapi.com.br/api/cnpj/v1
```

Frontend, caso necessário:

```env
VITE_API_URL=http://localhost:3001
```

---

# 22. Git

O projeto deverá utilizar Git desde o início.

## Commit inicial

```text
chore: inicializa projeto
```

## Frontend

```text
feat: cria estrutura inicial do frontend
```

## Backend

```text
feat: cria API de consulta de empresas
```

## Validação

```text
feat: adiciona validação de CNPJ
```

## Tratamento de erros

```text
feat: implementa tratamento de erros
```

## Histórico

```text
feat: adiciona histórico das consultas
```

## Responsividade

```text
style: ajusta interface responsiva
```

## Documentação

```text
docs: adiciona README
```

Evitar fazer apenas um commit gigantesco no final.

---

# 23. .gitignore

Deverá conter pelo menos:

```gitignore
node_modules/
.env
dist/
coverage/
*.log
```

---

# 24. Testes

Caso haja tempo, implementar testes para:

### Backend

```text
GET /api/empresas/:cnpj
```

Cenários:

- CNPJ válido;
- CNPJ inválido;
- CNPJ inexistente;
- Falha da BrasilAPI.

### Frontend

Testar:

- Input;
- Validação;
- Loading;
- Exibição dos dados;
- Mensagens de erro;
- Histórico.

---

# 25. Critérios de aceite

A aplicação será considerada funcional quando:

- [x] O usuário conseguir informar um CNPJ;
- [x] O CNPJ for validado no frontend;
- [x] O CNPJ for validado no backend;
- [x] O frontend chamar o backend;
- [x] O backend chamar a BrasilAPI;
- [x] Os dados da empresa forem retornados;
- [x] Razão social for exibida;
- [x] Nome fantasia for exibido;
- [x] Situação cadastral for exibida;
- [x] CNAE principal for exibido;
- [x] Data de abertura for exibida;
- [x] Endereço completo for exibido;
- [x] Loading for exibido durante a consulta;
- [x] CNPJ inválido for tratado;
- [x] Empresa inexistente for tratada;
- [x] Falha da API for tratada;
- [x] Últimas 5 consultas forem armazenadas;
- [x] Interface funcionar em desktop;
- [x] Interface funcionar em mobile;
- [x] Código estiver organizado;
- [x] `.env` não estiver no Git;
- [x] README estiver documentado.

### Evidências da validação

- Frontend executado em `http://localhost:5173` e backend em `http://localhost:3001`;
- Consulta real validada com `27.865.757/0001-02`;
- Resposta real da BrasilAPI validada com código HTTP `200`;
- CNPJ inválido validado com resposta HTTP `400`;
- Empresa inexistente validada com resposta HTTP `404`;
- Falha da BrasilAPI validada com resposta HTTP `503`;
- Loading, mensagens de erro e reconsulta pelo histórico verificados no navegador;
- Histórico limitado a cinco registros por teste automatizado no navegador;
- Interface verificada visualmente em viewport desktop (1296px) e mobile (375px);
- Frontend aprovado pelo lint e pelo build de produção;
- Backend aprovado pelos testes automatizados;
- `.env` não versionado; apenas arquivos `.env.example` presentes.

---

# 26. Ordem recomendada de desenvolvimento

## Etapa 1 — Preparação

- [x] Criar repositório GitHub
- [x] Criar estrutura do projeto
- [x] Configurar Git
- [x] Criar `.gitignore`
- [x] Criar README inicial

---

## Etapa 2 — Backend

- [x] Inicializar Node.js
- [x] Instalar Express
- [x] Instalar Axios
- [x] Instalar CORS
- [x] Criar servidor
- [x] Criar rota
- [x] Criar controller
- [x] Criar service BrasilAPI
- [x] Criar validação de CNPJ
- [x] Implementar tratamento de erros
- [x] Testar endpoint

---

## Etapa 3 — Frontend

- [x] Criar projeto React + Vite
- [x] Criar Header
- [x] Criar página Home
- [x] Criar SearchForm
- [x] Criar CompanyCard
- [x] Criar Loading
- [x] Criar ErrorMessage
- [x] Criar SearchHistory
- [x] Criar service da API
- [x] Implementar consulta

---

## Etapa 4 — Integração

- [x] Conectar frontend ao backend
- [x] Testar CNPJ válido
- [x] Testar CNPJ inválido
- [x] Testar empresa inexistente
- [x] Testar erro da API
- [x] Testar loading

---

## Etapa 5 — Histórico

- [x] Implementar localStorage
- [x] Limitar histórico a 5 registros
- [x] Permitir nova consulta através do histórico

---

## Etapa 6 — Interface

- [x] Melhorar layout
- [x] Responsividade
- [x] Estados visuais
- [x] Loading
- [x] Mensagens de erro
- [x] Máscara de CNPJ
- [x] Ajustes mobile

---

## Etapa 7 — Testes

- [x] Testes do backend
- [x] Testes de validação
- [x] Testes de erros
- [x] Testes do frontend, se houver tempo

---

## Etapa 8 — Finalização

- [x] Revisar código
- [x] Remover código desnecessário
- [x] Revisar `.gitignore`
- [x] Criar `.env.example`
- [x] Atualizar README
- [x] Executar projeto do zero
- [x] Fazer build
- [x] Testar novamente
- [x] Revisar commits
- [x] Subir projeto para GitHub

---

### Observações da execução

- As etapas 1 a 6 foram concluídas e verificadas nos commits e branches do projeto;
- Os testes do backend, validação e tratamento de erros foram automatizados e aprovados;
- A interface foi validada manualmente no navegador e também por uma suíte automatizada com Vitest, Testing Library e jsdom;
- A atualização local desta checklist ainda precisa ser enviada ao GitHub;
- O `.gitignore` está presente e padronizado nas branches `frontend` e `backend`;
- A suíte do frontend possui 9 testes aprovados; o commit `ca033c7` ainda precisa ser enviado ao GitHub;
- A branch `main` permanece somente com a documentação, conforme a organização atual do repositório.

# 27. Estrutura final esperada

```text
consulta-empresas/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── SearchForm.jsx
│   │   │   ├── CompanyCard.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   └── SearchHistory.jsx
│   │   │
│   │   ├── pages/
│   │   │   └── Home.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── utils/
│   │   │   ├── cnpj.js
│   │   │   └── storage.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── empresaController.js
│   │   │
│   │   ├── routes/
│   │   │   └── empresaRoutes.js
│   │   │
│   │   ├── services/
│   │   │   └── brasilApiService.js
│   │   │
│   │   ├── utils/
│   │   │   └── cnpj.js
│   │   │
│   │   ├── middlewares/
│   │   │   └── errorHandler.js
│   │   │
│   │   └── app.js
│   │
│   ├── tests/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── .env.example
│
├── .gitignore
├── README.md
└── ESCOPO.md
```

---

# 28. README.md

O README deverá conter:

## 1. Sobre o projeto

Explicação breve da aplicação.

## 2. Tecnologias

```text
React
Vite
JavaScript
CSS
Node.js
Express
Axios
BrasilAPI
Git
GitHub
```

## 3. Funcionalidades

- Consulta por CNPJ;
- Validação;
- Exibição dos dados;
- Loading;
- Tratamento de erros;
- Histórico das últimas 5 consultas.

## 4. Estrutura

Explicação das pastas frontend/backend.

## 5. Instalação

Exemplo:

```bash
git clone URL_DO_REPOSITORIO
cd consulta-empresas
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
npm install
npm run dev
```

## 6. Variáveis de ambiente

Explicar `.env` e `.env.example`.

## 7. API

Documentar:

```http
GET /api/empresas/:cnpj
```

## 8. Decisões técnicas

Explicar:

- Por que React;
- Por que Node/Express;
- Por que separar frontend/backend;
- Por que localStorage;
- Por que não utilizar banco na primeira versão.

## 9. Tratamento de erros

Documentar:

```text
400
404
502
503
```

## 10. Melhorias futuras

Exemplos:

- Banco de dados;
- Cache;
- Autenticação;
- Testes adicionais;
- Deploy;
- Histórico persistente por usuário.

---

# 29. Funcionalidades opcionais

Somente implementar depois que todos os requisitos obrigatórios estiverem funcionando.

Prioridade:

### Alta

```text
Testes automatizados
```

### Média

```text
Cache
```

### Média

```text
Deploy
```

### Baixa

```text
Banco de dados
```

### Baixa

```text
Autenticação
```

Não implementar funcionalidades extras em detrimento dos requisitos obrigatórios.

---

# 30. Escopo mínimo para entrega

Caso o tempo fique limitado, a versão mínima deverá possuir:

```text
React
   ↓
Formulário CNPJ
   ↓
Backend Express
   ↓
BrasilAPI
   ↓
Dados da empresa
```

Com:

- Validação;
- Loading;
- Erros;
- Histórico de 5 consultas;
- Responsividade;
- README;
- GitHub.

Essa versão já atende ao núcleo do desafio.

---

# 31. Escopo ideal para apresentação

A versão final recomendada será:

```text
                 ┌─────────────────────┐
                 │      FRONTEND       │
                 │   React + Vite      │
                 └──────────┬──────────┘
                            │
                            │ HTTP
                            ▼
                 ┌─────────────────────┐
                 │       BACKEND       │
                 │   Node + Express    │
                 └──────────┬──────────┘
                            │
                            │ HTTP
                            ▼
                 ┌─────────────────────┐
                 │     BrasilAPI       │
                 │ Consulta de CNPJ    │
                 └─────────────────────┘

                         +

                    localStorage
                         │
                         ▼
                  Últimas 5 consultas
```

---

# 32. Resultado esperado

Ao final, o candidato deverá entregar uma aplicação funcional, organizada e documentada, demonstrando conhecimentos de:

- Desenvolvimento frontend;
- Desenvolvimento backend;
- Consumo de API;
- Validação de dados;
- Tratamento de erros;
- Componentização;
- Responsividade;
- Organização de código;
- Git/GitHub;
- Documentação.

O foco deverá ser uma solução **simples, funcional, organizada e bem documentada**, evitando complexidade desnecessária.