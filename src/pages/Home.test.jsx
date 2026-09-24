import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Home from './Home'
import { consultarEmpresa } from '../services/api'

vi.mock('../services/api', () => ({
  consultarEmpresa: vi.fn(),
}))

const COMPANY = {
  razao_social: 'Empresa Exemplo LTDA',
  nome_fantasia: 'Empresa Exemplo',
  cnpj: '27865757000102',
  descricao_situacao_cadastral: 'ATIVA',
  cnae_fiscal: '6200101',
  cnae_fiscal_descricao: 'Desenvolvimento de programas de computador',
  data_inicio_atividade: '2020-01-01',
  logradouro: 'Rua Exemplo',
  numero: '100',
  bairro: 'Centro',
  municipio: 'São Paulo',
  uf: 'SP',
  cep: '01001000',
}

function fillCnpj(value = '27.865.757/0001-02') {
  fireEvent.change(screen.getByRole('textbox', { name: 'CNPJ da empresa' }), {
    target: { value },
  })
}

function submitSearch() {
  fireEvent.click(screen.getByRole('button', { name: 'Consultar' }))
}

describe('página inicial', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.mocked(consultarEmpresa).mockReset()
  })

  it('valida o CNPJ no frontend antes de chamar a API', () => {
    render(<Home />)
    fillCnpj('11.111.111/1111-11')
    submitSearch()

    expect(consultarEmpresa).not.toHaveBeenCalled()
    expect(screen.getByRole('alert')).toHaveTextContent('CNPJ inválido')
  })

  it('exibe loading durante a consulta e os dados ao finalizar', async () => {
    let resolveRequest
    vi.mocked(consultarEmpresa).mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve
      }),
    )

    render(<Home />)
    fillCnpj()
    submitSearch()

    expect(screen.getByRole('status')).toHaveTextContent('Consultando empresa...')
    expect(screen.getByRole('button', { name: 'Consultando...' })).toBeDisabled()

    await act(async () => {
      resolveRequest(COMPANY)
    })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Empresa Exemplo LTDA' })).toBeInTheDocument()
    })

    expect(screen.getByText('Empresa Exemplo')).toBeInTheDocument()
    expect(screen.getByText('ATIVA', { selector: '.status-badge' })).toBeInTheDocument()
    expect(screen.getByText(/Desenvolvimento de programas/)).toBeInTheDocument()
    expect(screen.getByText('01/01/2020')).toBeInTheDocument()
    expect(screen.getByText('Rua Exemplo, 100')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /27\.865\.757\/0001-02/ })).toBeInTheDocument()
    expect(window.localStorage.getItem('historicoCnpj')).toContain('27865757000102')
  })

  it('exibe mensagem amigável quando a consulta falha', async () => {
    vi.mocked(consultarEmpresa).mockRejectedValue(
      new Error('Empresa não encontrada. Verifique o CNPJ informado.'),
    )

    render(<Home />)
    fillCnpj()
    submitSearch()

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Empresa não encontrada. Verifique o CNPJ informado.',
      )
    })
  })
})
