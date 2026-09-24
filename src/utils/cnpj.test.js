import { describe, expect, it } from 'vitest'
import { formatCnpj, isValidCnpj, onlyDigits } from './cnpj'

describe('utilitários de CNPJ', () => {
  it('remove caracteres não numéricos', () => {
    expect(onlyDigits('27.865.757/0001-02')).toBe('27865757000102')
  })

  it('valida CNPJs com dígitos verificadores corretos', () => {
    expect(isValidCnpj('27.865.757/0001-02')).toBe(true)
    expect(isValidCnpj('04.252.011/0001-10')).toBe(true)
  })

  it('recusa CNPJs inválidos ou com tamanho incorreto', () => {
    expect(isValidCnpj('11.111.111/1111-11')).toBe(false)
    expect(isValidCnpj('27.865.757/0001-03')).toBe(false)
    expect(isValidCnpj('123')).toBe(false)
  })

  it('formata o CNPJ no padrão brasileiro', () => {
    expect(formatCnpj('27865757000102')).toBe('27.865.757/0001-02')
  })
})
