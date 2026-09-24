function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a className="brand" href="#top" aria-label="Consulta de Empresas - início">
          <span className="brand-mark" aria-hidden="true">
            C
          </span>
          <span className="brand-name">
            Consulta<span>Empresas</span>
          </span>
        </a>

        <nav aria-label="Navegação principal">
          <a className="nav-link is-active" href="#consulta">
            Início
          </a>
        </nav>
      </div>
    </header>
  )
}

export default Header
