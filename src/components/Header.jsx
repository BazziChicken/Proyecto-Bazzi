import logo from "../assets/LOGGO_BAZZI_CHICKEN.png"

export default function Header({ activeCategory, setActiveCategory, cartCount, onCart, onInfo, menu, onInicio, busqueda, setBusqueda }) {
  const buscando = busqueda.trim().length > 0

  return (
    <header className="sticky top-0 z-50 text-white border-b backdrop-blur-xl" style={{ background: "rgba(8, 5, 4, 0.88)", borderColor: "var(--line)" }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-3 pb-2 flex justify-between items-center gap-3">
        <button type="button" className="flex items-center gap-2 min-w-0 text-left" onClick={onInicio} aria-label="Ir al inicio">
          <img src={logo} alt="Bazzi Logo" className="h-14 w-14 sm:h-16 sm:w-16 object-contain drop-shadow-[0_8px_18px_rgba(255,106,26,0.22)]" />
          <div className="min-w-0">
            <div className="font-display font-black text-lg sm:text-2xl tracking-[0.08em] leading-none truncate" style={{ color: "var(--gold)" }}>BAZZI CHICKEN</div>
            <div className="text-[10px] sm:text-xs tracking-widest mt-1" style={{ color: "var(--muted)" }}>MÁS QUE POLLOS</div>
          </div>
        </button>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={onInfo}
            className="text-xs border rounded-full px-3 h-11 transition-colors hover:bg-white/10"
            style={{ borderColor: "var(--line)", color: "var(--muted)" }}
          >
            Info
          </button>
          <button
            type="button"
            onClick={onCart}
            disabled={cartCount === 0}
            aria-label={cartCount === 0 ? "Carrito vacío" : `Ver pedido, ${cartCount} ${cartCount === 1 ? "producto" : "productos"}`}
            className="relative w-11 h-11 rounded-full border flex items-center justify-center transition-all enabled:hover:brightness-110 disabled:cursor-default"
            style={
              cartCount > 0
                ? { borderColor: "var(--gold)", color: "#140803", background: "linear-gradient(135deg, var(--gold-light), var(--gold) 48%, var(--ember))", boxShadow: "0 8px 20px rgba(255, 106, 26, 0.28)" }
                : { borderColor: "var(--line)", color: "var(--muted)", background: "rgba(255,255,255,0.03)" }
            }
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="20" r="1.4" />
              <circle cx="18" cy="20" r="1.4" />
              <path d="M2.5 3.5h2.6l2.6 12.1a1.6 1.6 0 0 0 1.6 1.3h8.3a1.6 1.6 0 0 0 1.6-1.2l1.7-7.2H6.1" />
            </svg>
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full text-[11px] font-black flex items-center justify-center"
                style={{ background: "var(--paper)", color: "#140803", border: "2px solid var(--ink)" }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 pb-2">
        <label className="relative block">
          <span className="sr-only">Buscar en el menú</span>
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true" style={{ color: "var(--muted)" }}>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="search"
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); window.scrollTo(0, 0) }}
            placeholder="Buscar pollo, papas, bebidas..."
            enterKeyHint="search"
            className="w-full h-11 rounded-full pl-11 pr-11 text-sm text-white outline-none border transition-colors focus:border-[var(--gold)] [&::-webkit-search-cancel-button]:hidden"
            style={{ background: "rgba(255,255,255,0.05)", borderColor: buscando ? "var(--gold)" : "var(--line)" }}
          />
          {buscando && (
            <button
              type="button"
              onClick={() => setBusqueda("")}
              aria-label="Borrar búsqueda"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-lg hover:bg-white/10"
              style={{ color: "var(--muted)" }}
            >
              ×
            </button>
          )}
        </label>
      </div>

      <nav className="max-w-7xl mx-auto flex gap-2 px-3 sm:px-4 pb-3 overflow-x-auto scrollbar-hide">
        {menu.map((section) => {
          const activa = !buscando && activeCategory === section.category
          return (
            <button
              key={section.category}
              onClick={() => setActiveCategory(section.category)}
              aria-pressed={activa}
              className="whitespace-nowrap text-xs tracking-wide px-4 py-2 rounded-full border transition-all"
              style={
                activa
                  ? { background: "var(--gold)", color: "#140803", borderColor: "var(--gold)", fontWeight: 800, boxShadow: "0 8px 20px rgba(255, 106, 26, 0.22)" }
                  : { borderColor: "var(--line)", color: "var(--muted)", background: "rgba(255,255,255,0.03)" }
              }
            >
              {section.category}
            </button>
          )
        })}
      </nav>
    </header>
  )
}
