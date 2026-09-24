import { formatCnpj } from '../utils/cnpj'

function SearchForm({ value, onChange, onSubmit, loading }) {
  return (
    <form className="search-form" onSubmit={onSubmit} noValidate>
      <label className="field-label" htmlFor="cnpj">
        CNPJ da empresa
      </label>

      <div className="search-row">
        <div className="input-group">
          <span className="input-icon" aria-hidden="true">
            #
          </span>
          <input
            id="cnpj"
            name="cnpj"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={18}
            placeholder="00.000.000/0000-00"
            value={value}
            onChange={(event) => onChange(formatCnpj(event.target.value))}
            disabled={loading}
            aria-describedby="cnpj-help"
          />
        </div>

        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="button-spinner" aria-hidden="true" />
              Consultando...
            </>
          ) : (
            <>
              Consultar
              <span className="button-arrow" aria-hidden="true">
                →
              </span>
            </>
          )}
        </button>
      </div>

      <p className="field-help" id="cnpj-help">
        Digite os 14 dígitos do CNPJ. Os dados serão consultados diretamente na BrasilAPI.
      </p>
    </form>
  )
}

export default SearchForm
