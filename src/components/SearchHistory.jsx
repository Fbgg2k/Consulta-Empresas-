import { formatCnpj } from '../utils/cnpj'

function SearchHistory({ items, onSelect, disabled }) {
  return (
    <section className="history-card" aria-labelledby="history-title">
      <div className="history-header">
        <div>
          <p className="eyebrow">Sua atividade</p>
          <h2 id="history-title">Últimas consultas</h2>
        </div>
        <span className="history-count">{items.length}/5</span>
      </div>

      {items.length > 0 ? (
        <ol className="history-list">
          {items.map((cnpj, index) => (
            <li key={cnpj}>
              <button
                className="history-item"
                type="button"
                onClick={() => onSelect(cnpj)}
                disabled={disabled}
              >
                <span className="history-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="history-cnpj">{formatCnpj(cnpj)}</span>
                <span className="history-arrow" aria-hidden="true">
                  ↗
                </span>
              </button>
            </li>
          ))}
        </ol>
      ) : (
        <div className="history-empty">
          <span aria-hidden="true">◷</span>
          <p>Suas consultas mais recentes aparecerão aqui.</p>
        </div>
      )}
    </section>
  )
}

export default SearchHistory
