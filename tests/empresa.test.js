const assert = require('node:assert/strict')
const http = require('node:http')
const test = require('node:test')
const request = require('supertest')
const app = require('../src/app')

const VALID_CNPJ = '27865757000102'

function startMockServer(handler) {
  const server = http.createServer(handler)

  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address()
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` })
    })
  })
}

function closeServer(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error)
        return
      }

      resolve()
    })
  })
}

test('responde ao health check', async () => {
  const response = await request(app).get('/health')

  assert.equal(response.status, 200)
  assert.deepEqual(response.body, { status: 'ok' })
})

test('retorna 400 para CNPJ inválido', async () => {
  const response = await request(app).get('/api/empresas/11111111111111')

  assert.equal(response.status, 400)
  assert.equal(response.body.error.code, 'INVALID_CNPJ')
})

test('retorna os dados recebidos da BrasilAPI', async () => {
  const previousUrl = process.env.BRASIL_API_URL
  const { server, baseUrl } = await startMockServer((req, res) => {
    assert.equal(req.url, `/${VALID_CNPJ}`)
    res.setHeader('Content-Type', 'application/json')
    res.end(
      JSON.stringify({
        razao_social: 'Empresa Exemplo LTDA',
        nome_fantasia: 'Empresa Exemplo',
        situacao_cadastral: 2,
        descricao_situacao_cadastral: 'ATIVA',
      }),
    )
  })

  process.env.BRASIL_API_URL = baseUrl

  try {
    const response = await request(app).get(`/api/empresas/${VALID_CNPJ}`)

    assert.equal(response.status, 200)
    assert.equal(response.body.empresa.razao_social, 'Empresa Exemplo LTDA')
    assert.equal(response.body.empresa.descricao_situacao_cadastral, 'ATIVA')
  } finally {
    process.env.BRASIL_API_URL = previousUrl
    await closeServer(server)
  }
})

test('converte empresa inexistente em 404', async () => {
  const previousUrl = process.env.BRASIL_API_URL
  const { server, baseUrl } = await startMockServer((req, res) => {
    res.statusCode = 404
    res.end(JSON.stringify({ message: 'CNPJ não encontrado' }))
  })

  process.env.BRASIL_API_URL = baseUrl

  try {
    const response = await request(app).get(`/api/empresas/${VALID_CNPJ}`)

    assert.equal(response.status, 404)
    assert.equal(response.body.error.code, 'COMPANY_NOT_FOUND')
  } finally {
    process.env.BRASIL_API_URL = previousUrl
    await closeServer(server)
  }
})
