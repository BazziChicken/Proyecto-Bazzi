import logo from "../assets/LOGO_BAZZI.png"

export default function Header({ activeCategory, setActiveCategory, cartCount, onInfo, onEspecial, menu }) {
  return (
    <header className="bg-neutral-950 text-white sticky top-0 z-50 border-b" style={{ borderColor: "#2a2a2a" }}>
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Bazzi Logo" className="h-12 w-12 object-contain" />
          <div>
            <div className="font-black text-2xl tracking-widest" style={{ color: "var(--gold)" }}>BAZZI</div>
            <div className="text-xs tracking-widest text-neutral-400 mt-0.5">ARABIAN FOOD</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={onInfo}
            className="text-xs border rounded-full px-3 py-1.5 transition-colors hover:bg-neutral-800"
            style={{ borderColor: "#404040", color: "#a3a3a3" }}
          >
            Info
          </button>
          <button
            onClick={onEspecial}
            className="text-xs border rounded-full px-3 py-1.5 transition-colors hover:bg-neutral-800"
            style={{ borderColor: "#404040", color: "#a3a3a3" }}
          >
            Especial
          </button>
          <div
            className="text-xs font-medium border rounded-full px-3 py-1.5"
            style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
          >
            Carrito ({cartCount})
          </div>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
        {menu.map((section) => (
          <button
            key={section.category}
            onClick={() => setActiveCategory(section.category)}
            className="whitespace-nowrap text-xs tracking-wide px-4 py-1.5 rounded-full border transition-all"
            style={
              activeCategory === section.category
                ? { background: "var(--gold)", color: "#0a0a0a", borderColor: "var(--gold)", fontWeight: 600 }
                : { borderColor: "#404040", color: "#a3a3a3" }
            }
          >
            {section.category}
          </button>
        ))}
      </nav>
    </header>
  )
}