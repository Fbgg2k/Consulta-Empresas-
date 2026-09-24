# Frontend - Consulta de Empresas

Aplicacao React criada com Vite para consultar dados publicos de empresas a partir do CNPJ.
O frontend conversa somente com a API do backend; a BrasilAPI nao e acessada diretamente pelo navegador.

## Funcionalidades

- Mascara automatica no formato `00.000.000/0000-00`;
- Validacao local do CNPJ, incluindo os digitos verificadores;
- Consulta ao backend com estados de carregamento, sucesso e erro;
- Exibicao da razao social, nome fantasia, situacao cadastral, CNAE e endereco;
- Historico das ultimas 5 consultas usando `localStorage`;
- Reconsulta ao selecionar um item do historico;
- Layout responsivo para desktop, tablet e mobile.

## Tecnologias

- React 19;
- Vite;
- JavaScript;
- CSS;
- Fetch API;
- Oxlint.

## Pre-requisitos

- Node.js 20.19 ou superior;
- npm;
- Backend em execucao, por padrao em `http://localhost:3001`.

## Instalacao e execucao

Na raiz do repositorio:

```bash
cd frontend
npm install
npm run dev
```

Abra `http://localhost:5173` no navegador. O backend deve ser iniciado em outro terminal:

```bash
cd backend
npm install
npm run dev
```

## Scripts disponiveis

| Comando | Descricao |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento do Vite |
| `npm run build` | Gera a versao de producao em `dist/` |
| `npm run preview` | Serve localmente o build de producao |
| `npm run lint` | Executa o Oxlint |

## Variaveis de ambiente

O frontend usa `http://localhost:3001` quando `VITE_API_URL` nao estiver definida.
Para apontar para outro backend, crie um arquivo `.env` nesta pasta:

```env
VITE_API_URL=http://localhost:3001
```

Depois de alterar uma variavel, reinicie o servidor do Vite.

## Organizacao do codigo

```text
src/
├── components/       Componentes de interface reutilizaveis
├── pages/            Paginas da aplicacao
├── services/         Comunicacao com a API do backend
├── utils/            Validacao, mascara e historico do CNPJ
├── App.jsx           Componente raiz
├── main.jsx          Ponto de entrada do React
└── index.css         Estilos globais e responsividade
```

O fluxo principal esta em `src/pages/Home.jsx`: valida o valor informado, solicita a empresa ao backend,
atualiza o resultado e registra consultas bem-sucedidas no historico.

## API consumida

```http
GET {VITE_API_URL}/api/empresas/:cnpj
```

Exemplo:

```bash
curl http://localhost:3001/api/empresas/27865757000102
```

Em caso de sucesso, o backend retorna os dados dentro da propriedade `empresa`:

```json
{
	"empresa": {
		"razao_social": "Empresa Exemplo LTDA",
		"nome_fantasia": "Empresa Exemplo",
		"descricao_situacao_cadastral": "ATIVA"
	}
}
```

Erros seguem o formato:

```json
{
	"error": {
		"code": "INVALID_CNPJ",
		"message": "CNPJ invalido. Informe um CNPJ valido."
	}
}
```

O frontend apresenta a mensagem recebida e trata tambem falhas de rede quando o backend nao esta disponivel.

## Historico

As consultas validas sao armazenadas no navegador com a chave `historicoCnpj`.
O item mais recente fica no inicio da lista, CNPJs repetidos sao reposicionados e a lista e limitada a cinco itens.
Nenhum dado de autenticacao ou informacao sensivel e armazenado.

## Build de producao

```bash
npm run lint
npm run build
npm run preview
```

O build gerado em `dist/` pode ser publicado em um servidor estatico. Nesse ambiente,
configure `VITE_API_URL` antes da compilacao para apontar para a API publicada.
