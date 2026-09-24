const AppError = require('../errors/AppError')

function notFound(req, res, next) {
  next(new AppError('Rota não encontrada.', 404, 'ROUTE_NOT_FOUND'))
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error)
  }

  const statusCode = Number.isInteger(error.statusCode)
    ? error.statusCode
    : 500
  const message = statusCode >= 500 && process.env.NODE_ENV === 'production'
    ? 'Erro interno do servidor.'
    : error.message || 'Erro interno do servidor.'

  return res.status(statusCode).json({
    error: {
      code: error.code || 'INTERNAL_ERROR',
      message,
    },
  })
}

module.exports = {
  notFound,
  errorHandler,
}
