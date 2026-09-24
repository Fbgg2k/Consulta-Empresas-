const assert = require('node:assert/strict')
const test = require('node:test')
const { isValidCnpj } = require('../src/utils/cnpj')

test('aceita um CNPJ com dígitos verificadores válidos', () => {
  assert.equal(isValidCnpj('27.865.757/0001-02'), true)
  assert.equal(isValidCnpj('04.252.011/0001-10'), true)
})

test('recusa CNPJ com tamanho, caracteres ou dígitos verificadores inválidos', () => {
  assert.equal(isValidCnpj('123'), false)
  assert.equal(isValidCnpj('11.111.111/1111-11'), false)
  assert.equal(isValidCnpj('27.865.757/0001-03'), false)
})
