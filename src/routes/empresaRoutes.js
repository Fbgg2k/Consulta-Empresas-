const express = require('express')
const { getEmpresa } = require('../controllers/empresaController')

const empresaRoutes = express.Router()

empresaRoutes.get('/:cnpj', getEmpresa)

module.exports = empresaRoutes
