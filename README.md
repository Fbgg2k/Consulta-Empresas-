# Frontend — Consulta de Empresas

Interface React para consultar informações públicas de empresas a partir do CNPJ.

O frontend conversa **somente com a API do backend**. A BrasilAPI não é acessada diretamente pelo navegador.

---

## Funcionalidades

- Máscara automática de CNPJ no formato `00.000.000/0000-00`;
- Validação local do CNPJ, incluindo dígitos verificadores;
- Consulta ao backend com estados de carregamento, sucesso e erro;
- Exibição de razão social, nome fantasia e situação cadastral;
- Exibição de CNAE principal, data de abertura e endereço;
- Histórico das últimas cinco consultas;
- Reconsulta a partir de um item do histórico;
- Layout responsivo para desktop, tablet e mobile;
- Tratamento de falhas de rede e erros retornados pela API;
- Testes automatizados com Vitest e Testing Library.

---

## Tecnologias

- React 19;
- Vite 8;
- JavaScript;
- CSS responsivo;
- Fetch API;
- Vitest;
- Testing Library;
- `@testing-library/jest-dom`;
- jsdom;
- Oxlint.

---

## Pré-requisitos

- Node.js `20.19+` ou `22.12+`;
- npm `10+`;
- backend executado em `http://localhost:3001`;
- acesso à internet para o backend consultar a BrasilAPI.

O projeto foi validado com Node.js 24 e npm 11.

Se necessário, instale o Node.js com nvm:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 24
nvm use 24
```

---

## Clonando a branch frontend

A branch `frontend` deve ser clonada em uma pasta própria:

```bash
git clone --branch frontend --single-branch https://github.com/Fbgg2k/Consulta-Empresas-.git consulta-empresas-frontend
cd consulta-empresas-frontend
```

O código executável do frontend está na raiz dessa branch.

---

## Executando localmente

### 1. Inicie o backend

Em um terminal separado, dentro da branch `backend`:

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

### 2. Inicie o frontend

Em outro terminal:

```bash
cd consulta-empresas-frontend
npm ci
npm run dev
```

Abra no navegador:

```text
http://localhost:5173
```

Para expor o Vite em uma rede local:

```bash
npm run dev -- --host 0.0.0.0
```

O frontend usa `http://localhost:3001` por padrão. Para apontar para outro backend, crie um arquivo `.env` na raiz da branch frontend:

```env
VITE_API_URL=http://localhost:3001
```

Reinicie o Vite depois de alterar essa variável.

---

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento do Vite |
| `npm run build` | Gera o build de produção em `dist/` |
| `npm run preview` | Serve localmente o build de produção |
| `npm run lint` | Executa o Oxlint |
| `npm test` | Executa a suíte de testes uma vez |
| `npm run test:watch` | Executa os testes em modo interativo |

---

## Organização do código

```text
.
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── CompanyCard.jsx
│   │   ├── ErrorMessage.jsx
│   │   ├── Header.jsx
│   │   ├── Loading.jsx
│   │   ├── SearchForm.jsx
│   │   └── SearchHistory.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── Home.test.jsx
│   ├── services/
│   │   └── api.js
│   ├── test/
│   │   └── setup.js
│   ├── utils/
│   │   ├── cnpj.js
│   │   ├── cnpj.test.js
│   │   ├── storage.js
│   │   └── storage.test.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
├── vitest.config.js
└── README.md
```

O fluxo principal está em `src/pages/Home.jsx`. Ele:

1. controla o valor do campo de CNPJ;
2. aplica a máscara;
3. valida localmente;
4. chama o serviço da API;
5. exibe loading ou resultado;
6. exibe mensagens de erro;
7. salva consultas bem-sucedidas no histórico.

---

## API consumida

O frontend chama o backend através de:

```http
GET {VITE_API_URL}/api/empresas/:cnpj
```

Exemplo:

```bash
curl http://localhost:3001/api/empresas/27865757000102
```

O backend aceita o CNPJ com ou sem máscara. O frontend envia os dígitos normalizados e exibe o objeto retornado em `empresa`:

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

### Erros

O backend retorna erros no formato:

```json
{
  "error": {
    "code": "INVALID_CNPJ",
    "message": "CNPJ inválido. Informe um CNPJ válido."
  }
}
```

O frontend exibe a mensagem recebida e também possui uma mensagem amigável para falhas de conexão com o backend.

---

## Histórico

As consultas bem-sucedidas são armazenadas no navegador com a chave:

```text
historicoCnpj
```

Regras implementadas:

- máximo de cinco registros;
- consulta mais recente primeiro;
- duplicatas removidas;
- item repetido reposicionado no início;
- clique no item inicia uma nova consulta;
- nenhuma informação pessoal é armazenada.

A implementação está em `src/utils/storage.js`.

---

## Testes automatizados

A suíte frontend cobre:

- normalização e máscara de CNPJ;
- CNPJ válido e inválido;
- limite de cinco registros;
- remoção de duplicatas;
- validação antes da chamada à API;
- estado de loading;
- exibição dos dados;
- tratamento de mensagem de erro;
- preenchimento do histórico.

Execute:

```bash
npm test
```

A configuração está em `vitest.config.js` e usa `src/test/setup.js`.

Resultado validado:

```text
3 arquivos de teste
9 testes aprovados
0 falhas
```

### Lint e build

```bash
npm run lint
npm run build
npm run preview
```

O build de produção é gerado em `dist/`.

---

## Integração com o backend

O backend deve estar disponível antes de realizar uma consulta. O fluxo é:

```text
SearchForm
    ↓
validação em src/utils/cnpj.js
    ↓
src/services/api.js
    ↓
GET http://localhost:3001/api/empresas/:cnpj
    ↓
CompanyCard
```

O frontend não deve ser alterado para chamar a BrasilAPI diretamente. A URL da API externa é responsabilidade do backend.

---

## Decisões técnicas

- a validação no frontend provide feedback imediato;
- o backend valida novamente para proteger a API;
- o histórico usa `localStorage` porque esta versão não possui autenticação nem banco de dados;
- componentes foram separados para manter a interface reutilizável;
- erros são exibidos em uma mensagem acessível com `role="alert"`;
- a interface possui estados de idle, loading, success e error;
- o CSS responsivo foi usado em vez de depender de um framework visual.

---

## Solução de problemas

### `npm run dev` não encontrado

Execute a instalação na raiz da branch frontend:

```bash
npm ci
```

### Backend não encontrado

Confirme que o backend está rodando:

```bash
curl http://localhost:3001/health
```

A resposta esperada é:

```json
{ "status": "ok" }
```

### Alteração de `VITE_API_URL` não refletida

Reinicie o Vite:

```bash
npm run dev
```

### Porta já está em uso

Encerre o processo anterior ou execute o Vite em outra porta:

```bash
npm run dev -- --port 5174
```

Nesse caso, atualize o CORS no backend ou use a URL correspondente no frontend.

---

## Documentação relacionada

- README principal e escopo: branch `main`;
- API backend: branch `backend`, arquivo `README.md`;
- critérios de aceite e ordem de desenvolvimento: `Escopo completo — Teste Técnico Estagiário Fullstack.md`.
