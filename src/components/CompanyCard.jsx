function formatDate(value) {
  if (!value) {
    return 'Não informado'
  }

  const [year, month, day] = value.split('-')

  if (year && month && day) {
    return `${day}/${month}/${year}`
  }

  return value
}

function displayValue(value) {
  return value || 'Não informado'
}

function CompanyCard({ company }) {
  const companyStatus = company.descricao_situacao_cadastral || company.situacao_cadastral
  const addressLine = [
    company.logradouro,
    company.numero,
    company.complemento,
  ]
    .filter(Boolean)
    .join(', ')

  const locationLine = [company.bairro, company.municipio, company.uf]
    .filter(Boolean)
    .join(' • ')

  return (
    <article className="company-card" aria-labelledby="company-card-title">
      <div className="company-card-header">
        <div>
          <p className="eyebrow">Dados da empresa</p>
          <h2 id="company-card-title">{displayValue(company.razao_social)}</h2>
          <p className="company-fantasy-name">{displayValue(company.nome_fantasia)}</p>
        </div>

        <span className={`status-badge status-${String(companyStatus || '').toLowerCase()}`}>
          {displayValue(companyStatus)}
        </span>
      </div>

      <div className="company-meta">
        <span>CNPJ: {company.cnpj || 'Não informado'}</span>
        {company.descricao_situacao_cadastral && (
          <span>{company.descricao_situacao_cadastral}</span>
        )}
      </div>

      <dl className="company-details">
        <div className="detail-item">
          <dt>CNAE principal</dt>
          <dd>
            {company.cnae_fiscal ? `${company.cnae_fiscal} — ` : ''}
            {displayValue(company.cnae_fiscal_descricao)}
          </dd>
        </div>
        <div className="detail-item">
          <dt>Data de abertura</dt>
          <dd>{formatDate(company.data_abertura || company.data_inicio_atividade)}</dd>
        </div>
      </dl>

      <div className="address-block">
        <div className="address-heading">
          <span className="address-icon" aria-hidden="true">
            ⌖
          </span>
          <h3>Endereço</h3>
        </div>
        <address>
          <span>{addressLine || 'Endereço não informado'}</span>
          <span>{locationLine || ''}</span>
          {company.cep && <span>CEP: {company.cep}</span>}
        </address>
      </div>
    </article>
  )
}

export default CompanyCard
