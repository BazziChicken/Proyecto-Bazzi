import logo from "../assets/LOGGO_BAZZI_CHICKEN.png"

export default function Header({ activeCategory, setActiveCategory, cartCount, onInfo, menu, onInicio }) {
  return (
    <header className="sticky top-0 z-50 text-white border-b backdrop-blur-xl" style={{ background: "rgba(8, 5, 4, 0.88)", borderColor: "var(--line)" }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-3 pb-2 flex justify-between items-center gap-3">
        <div className="flex items-center gap-2 min-w-0 cursor-pointer" onClick={onInicio}>
          <img src={logo} alt="Bazzi Logo" className="h-14 w-14 sm:h-16 sm:w-16 object-contain drop-shadow-[0_8px_18px_rgba(255,106,26,0.22)]" />
          <div className="min-w-0">
            <div className="font-display font-black text-lg sm:text-2xl tracking-[0.08em] leading-none truncate" style={{ color: "var(--gold)" }}>BAZZI CHICKEN</div>
            <div className="text-[10px] sm:text-xs tracking-widest mt-1" style={{ color: "var(--muted)" }}>MÁS QUE POLLOS</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={onInfo}
            className="text-xs border rounded-full px-3 py-2 transition-colors hover:bg-white/10"
            style={{ borderColor: "var(--line)", color: "var(--muted)" }}
          >
            Info
          </button>
          <div
            className="text-xs font-bold border rounded-full px-3 py-2"
            style={{ borderColor: "rgba(255, 106, 26, 0.45)", color: "var(--gold)", background: "rgba(255, 106, 26, 0.08)" }}
          >
            {cartCount}
          </div>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto flex gap-2 px-3 sm:px-4 pb-3 overflow-x-auto scrollbar-hide">
        {menu.map((section) => (
          <button
            key={section.category}
            onClick={() => setActiveCategory(section.category)}
            className="whitespace-nowrap text-xs tracking-wide px-4 py-2 rounded-full border transition-all"
            style={
              activeCategory === section.category
                ? { background: "var(--gold)", color: "#140803", borderColor: "var(--gold)", fontWeight: 800, boxShadow: "0 8px 20px rgba(255, 106, 26, 0.22)" }
                : { borderColor: "var(--line)", color: "var(--muted)", background: "rgba(255,255,255,0.03)" }
            }
          >
            {section.category}
          </button>
        ))}
      </nav>
    </header>
  )
}
