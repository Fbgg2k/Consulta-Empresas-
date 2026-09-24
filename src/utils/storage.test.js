import { beforeEach, describe, expect, it } from 'vitest'
import { addCnpjToHistory, getHistory } from './storage'

const VALID_CNPJS = [
  '27865757000102',
  '04252011000110',
  '11222333000181',
  '10000000000650',
  '10000000000579',
  '10000000000498',
]

describe('histórico de consultas', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('mantém no máximo cinco consultas e coloca a mais recente primeiro', () => {
    let history = []

    for (const cnpj of VALID_CNPJS) {
      history = addCnpjToHistory(cnpj)
    }

    expect(history).toHaveLength(5)
    expect(history[0]).toBe(VALID_CNPJS[5])
    expect(getHistory()).toEqual(history)
  })

  it('remove duplicatas e reposiciona um CNPJ consultado novamente', () => {
    VALID_CNPJS.slice(0, 3).forEach(addCnpjToHistory)
    const history = addCnpjToHistory(VALID_CNPJS[0])

    expect(history).toEqual([VALID_CNPJS[0], VALID_CNPJS[2], VALID_CNPJS[1]])
  })
})
