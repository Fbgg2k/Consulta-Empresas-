function Loading() {
  return (
    <div className="state-panel loading-panel" role="status" aria-live="polite">
      <span className="loading-spinner" aria-hidden="true" />
      <div>
        <strong>Consultando empresa...</strong>
        <p>Estamos buscando os dados cadastrais públicos.</p>
      </div>
    </div>
  )
}

export default Loading
