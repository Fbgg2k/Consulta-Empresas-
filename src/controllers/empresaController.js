const { onlyDigits, isValidCnpj } = require('../utils/cnpj')
const { consultarCnpj } = require('../services/brasilApiService')

async function getEmpresa(req, res, next) {
  try {
    const cnpj = onlyDigits(req.params.cnpj)

    if (!isValidCnpj(cnpj)) {
      return res.status(400).json({
        error: {
          code: 'INVALID_CNPJ',
          message: 'CNPJ inválido. Informe um CNPJ válido.',
        },
      })
    }

    const empresa = await consultarCnpj(cnpj)

    return res.status(200).json({ empresa })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  getEmpresa,
}
