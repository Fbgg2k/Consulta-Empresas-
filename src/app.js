require('dotenv').config()

const express = require('express')
const cors = require('cors')
const empresaRoutes = require('./routes/empresaRoutes')
const { notFound, errorHandler } = require('./middlewares/errorHandler')

const app = express()
const defaultFrontendUrl = 'http://localhost:5173'
const allowedOrigins = (process.env.FRONTEND_URL || defaultFrontendUrl)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.disable('x-powered-by')

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(null, false)
    },
  }),
)
app.use(express.json())

app.get('/health', (req, res) => {
  return res.status(200).json({ status: 'ok' })
})

app.use('/api/empresas', empresaRoutes)

app.use(notFound)
app.use(errorHandler)

module.exports = app
