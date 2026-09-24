const axios = require('axios')
const AppError = require('../errors/AppError')

const DEFAULT_BRASIL_API_URL = 'https://brasilapi.com.br/api/cnpj/v1'
const REQUEST_TIMEOUT = 10000

function getBaseUrl() {
  return (process.env.BRASIL_API_URL || DEFAULT_BRASIL_API_URL).replace(/\/$/, '')
}

async function consultarCnpj(cnpj) {
  try {
    const response = await axios.get(`${getBaseUrl()}/${cnpj}`, {
      timeout: REQUEST_TIMEOUT,
      headers: {
        Accept: 'application/json',
      },
    })

    return response.data
  } catch (error) {
    if (error.response?.status === 404) {
      throw new AppError(
        'Empresa não encontrada. Verifique o CNPJ informado.',
        404,
        'COMPANY_NOT_FOUND',
      )
    }

    if (error.code === 'ECONNABORTED' || !error.response) {
      throw new AppError(
        'Não foi possível consultar a BrasilAPI. Tente novamente mais tarde.',
        503,
        'BRASILAPI_UNAVAILABLE',
      )
    }

    throw new AppError(
      'A BrasilAPI retornou um erro ao consultar a empresa. Tente novamente mais tarde.',
      502,
      'BRASILAPI_ERROR',
    )
  }
}

module.exports = {
  consultarCnpj,
}
