const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message, status = 0, code = 'UNKNOWN_ERROR') {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

export async function consultarEmpresa(cnpj) {
  let response

  try {
    response = await fetch(`${API_URL}/api/empresas/${encodeURIComponent(cnpj)}`, {
      headers: {
        Accept: 'application/json',
      },
    })
  } catch {
    throw new ApiError(
      'Não foi possível conectar ao servidor. Verifique se o backend está em execução.',
      0,
      'NETWORK_ERROR',
    )
  }

  let payload = null

  try {
    payload = await response.json()
  } catch {
    payload = null
  }

  if (!response.ok) {
    const errorData = payload?.error
    const message = errorData?.message || payload?.message || 'Não foi possível consultar a empresa.'
    const code = errorData?.code || 'REQUEST_ERROR'

    throw new ApiError(message, response.status, code)
  }

  return payload?.empresa ?? payload
}
