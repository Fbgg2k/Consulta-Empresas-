import { useState } from 'react'
import CompanyCard from '../components/CompanyCard'
import ErrorMessage from '../components/ErrorMessage'
import Header from '../components/Header'
import Loading from '../components/Loading'
import SearchForm from '../components/SearchForm'
import SearchHistory from '../components/SearchHistory'
import { consultarEmpresa } from '../services/api'
import { addCnpjToHistory, getHistory } from '../utils/storage'
import { formatCnpj, isValidCnpj, onlyDigits } from '../utils/cnpj'

function Home() {
  const [cnpj, setCnpj] = useState('')
  const [company, setCompany] = useState(null)
  const [history, setHistory] = useState(() => getHistory())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function executeSearch(value = cnpj) {
    const normalizedCnpj = onlyDigits(value)
    setCnpj(formatCnpj(normalizedCnpj))

    if (!normalizedCnpj) {
      setCompany(null)
      setError('Informe um CNPJ para realizar a consulta.')
      return
    }

    if (!isValidCnpj(normalizedCnpj)) {
      setCompany(null)
      setError('CNPJ inválido. Informe um CNPJ válido com 14 dígitos.')
      return
    }

    setLoading(true)
    setError('')
    setCompany(null)

    try {
      const result = await consultarEmpresa(normalizedCnpj)
      setCompany(result)
      setHistory(addCnpjToHistory(normalizedCnpj))
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Não foi possível consultar a empresa no momento. Tente novamente mais tarde.',
      )
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    executeSearch(cnpj)
  }

  function handleHistorySelect(selectedCnpj) {
    executeSearch(selectedCnpj)
  }

  return (
    <div className="app-shell" id="top">
      <Header />

      <main>
        <section className="hero-section" id="consulta">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Consulta pública de empresas</p>
              <h1>
                Encontre informações
                <span>em poucos segundos.</span>
              </h1>
              <p className="hero-description">
                Consulte dados cadastrais públicos de uma empresa de forma simples, segura e
                rápida usando apenas o CNPJ.
              </p>

              <div className="hero-highlights" aria-label="Vantagens">
                <span>
                  <b>01</b> Dados públicos
                </span>
                <span>
                  <b>02</b> Consulta segura
                </span>
                <span>
                  <b>03</b> Resultado rápido
                </span>
              </div>
            </div>

            <div className="search-panel">
              <div className="panel-heading">
                <span className="panel-kicker">Comece agora</span>
                <h2>Qual empresa você procura?</h2>
                <p>Informe o CNPJ para ver os dados disponíveis.</p>
              </div>

              <SearchForm
                value={cnpj}
                onChange={setCnpj}
                onSubmit={handleSubmit}
                loading={loading}
              />

              <div className="result-area" aria-live="polite" aria-busy={loading}>
                {loading && <Loading />}
                {!loading && error && <ErrorMessage message={error} />}
                {!loading && !error && !company && (
                  <div className="empty-result">
                    <span className="empty-icon" aria-hidden="true">
                      ⌕
                    </span>
                    <strong>O resultado aparecerá aqui</strong>
                    <p>Faça uma consulta para visualizar os dados da empresa.</p>
                  </div>
                )}
                {!loading && company && <CompanyCard company={company} />}
              </div>
            </div>
          </div>
        </section>

        <section className="container history-section" aria-label="Histórico de consultas">
          <SearchHistory
            items={history}
            onSelect={handleHistorySelect}
            disabled={loading}
          />
        </section>

        <section className="container info-section" aria-label="Informações sobre o serviço">
          <div className="info-item">
            <span className="info-icon" aria-hidden="true">
              ◈
            </span>
            <div>
              <h2>Informação pública</h2>
              <p>Os dados exibidos são provenientes da BrasilAPI.</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon" aria-hidden="true">
              ⌁
            </span>
            <div>
              <h2>Privacidade em primeiro lugar</h2>
              <p>Nenhum dado pessoal é armazenado neste projeto.</p>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon" aria-hidden="true">
              ✓
            </span>
            <div>
              <h2>Simples e objetivo</h2>
              <p>Apenas as informações essenciais para sua consulta.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-content">
          <span>© 2026 Consulta Empresas</span>
          <span>Desenvolvido com React, Node.js e BrasilAPI</span>
        </div>
      </footer>
    </div>
  )
}

export default Home
