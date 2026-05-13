import { menu } from "../data/menu"
import logo from "../assets/LOGO_BAZZI.png"

export default function Header({ activeCategory, setActiveCategory, cartCount, onInfo }) {
  return (
    <header className="bg-neutral-950 text-white sticky top-0 z-50 border-b" style={{ borderColor: "#2a2a2a" }}>
      <div className="px-5 pt-5 pb-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img
            img src={logo} alt="Bazzi Logo" className="h-14 w-14 object-contain"
            alt="Bazzi Logo"
            className="h-16 w-16 object-contain"
          />
          <div>
            <div className="font-black text-3xl tracking-widest" style={{ color: "var(--gold)" }}>BAZZI</div>
            <div className="text-xs tracking-widest text-neutral-400 mt-0.5">ARABIAN FOOD</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onInfo}
            className="text-sm border rounded-full px-4 py-2 transition-colors hover:bg-neutral-800"
            style={{ borderColor: "#404040", color: "#a3a3a3" }}
          >
            Info
          </button>
          <div className="text-sm font-medium border rounded-full px-4 py-2" style={{ borderColor: "var(--gold)", color: "var(--gold)" }}>
            Carrito ({cartCount})
          </div>
        </div>
      </div>

      <nav className="flex gap-2 px-5 pb-3 overflow-x-auto scrollbar-hide">
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