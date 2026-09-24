function ErrorMessage({ message }) {
  return (
    <div className="state-panel error-panel" role="alert">
      <span className="error-icon" aria-hidden="true">
        !
      </span>
      <div>
        <strong>Não foi possível concluir a consulta</strong>
        <p>{message}</p>
      </div>
    </div>
  )
}

export default ErrorMessage
