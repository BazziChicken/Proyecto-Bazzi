import { useState } from "react"

const AGREGADOS = ["Arroz", "Papas fritas", "Ensalada"]
const SALCHIPAPA_VARIANTES = [
  { id: "sola", label: "Salchipapa sola", detail: "Precio normal", price: null },
  { id: "mini-fruna", label: "Con Mini Fruna", detail: "$4.000", price: 4000 },
  { id: "bebida-lata", label: "Con bebida lata", detail: "$4.800", price: 4800 }
]

export default function ItemCard({ item, qty, onAdd, onRemove }) {
  const [expanded, setExpanded] = useState(true)
  const [showAgregados, setShowAgregados] = useState(false)
  const [showSalchipapas, setShowSalchipapas] = useState(false)
  const [seleccionados, setSeleccionados] = useState([])
  const [bebidaLata, setBebidaLata] = useState(false)

  const fmt = (n) => "$" + Number(n).toLocaleString("es-CL")
  const nombre = item.nombre || item.name
  const descripcion = item.descripcion || item.desc
  const precio = item.precio || item.price
  const tags = item.tags ? item.tags.split(",").map(t => t.trim()) : []
  const esColacion = item.categoria === "Colaciones"
  const esSalchipapa = nombre?.toLowerCase().includes("salchipapa")

  const toggleAgregado = (a) => {
    if (seleccionados.includes(a)) {
      setSeleccionados(seleccionados.filter(s => s !== a))
    } else {
      if (seleccionados.length >= 2) return
      setSeleccionados([...seleccionados, a])
    }
  }

  const confirmarAgregados = () => {
    const agregados = bebidaLata ? [...seleccionados, "Bebida lata"] : seleccionados
    const precioFinal = Number(precio) + (bebidaLata ? 1200 : 0)
    const cartKey = `${item.id}:${agregados.join("|") || "sin-agregados"}`
    const itemConAgregados = { ...item, precio: precioFinal, price: precioFinal, agregados, cartKey }
    onAdd(itemConAgregados)
    setShowAgregados(false)
    setSeleccionados([])
    setBebidaLata(false)
  }

  const confirmarSalchipapa = (variante) => {
    const precioFinal = variante.price || Number(precio)
    const agregados = [variante.label]
    const itemConVariante = {
      ...item,
      precio: precioFinal,
      price: precioFinal,
      agregados,
      cartKey: `${item.id}:${variante.id}`
    }
    onAdd(itemConVariante)
    setShowSalchipapas(false)
  }

  const handleAdd = (e) => {
    e.stopPropagation()
    if (esColacion) {
      setShowAgregados(true)
    } else if (esSalchipapa) {
      setShowSalchipapas(true)
    } else {
      onAdd(item)
    }
  }

  return (
    <div className="glass-panel rounded-2xl overflow-hidden">
      <div
        className="p-4 flex justify-between items-center gap-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-base font-black text-white leading-snug">{nombre}</span>
            {tags.includes("popular") && (
              <span className="text-[11px] px-2 py-1 rounded-full font-bold" style={{ background: "rgba(255, 106, 26, 0.12)", color: "var(--gold)", border: "1px solid rgba(255, 106, 26, 0.24)" }}>Popular</span>
            )}
            {tags.includes("veg") && (
              <span className="text-[11px] px-2 py-1 rounded-full bg-green-950 text-green-300 border border-green-900 font-bold">Vegano</span>
            )}
            {item.stock > 0 && (
              <span className="text-[11px] px-2 py-1 rounded-full" style={{ background: "rgba(96, 165, 250, 0.12)", color: "#93c5fd", border: "1px solid rgba(96, 165, 250, 0.22)" }}>
                Stock: {item.stock}
              </span>
            )}
          </div>
          {!expanded && (
            <p className="text-xs leading-relaxed truncate" style={{ color: "var(--muted)" }}>{descripcion}</p>
          )}
          <p className="text-lg font-black mt-2" style={{ color: "var(--gold)" }}>{fmt(precio)}</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {qty === 0 ? (
            <button
              onClick={handleAdd}
              className="w-11 h-11 rounded-full flex items-center justify-center text-2xl font-light transition-all hover:brightness-110 warm-button"
              aria-label={`Agregar ${nombre}`}
            >
              +
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(item) }}
                className="w-10 h-10 rounded-full border text-white flex items-center justify-center text-lg hover:bg-white/10 transition-colors"
                style={{ borderColor: "var(--line)" }}
                aria-label={`Quitar ${nombre}`}
              >
                -
              </button>
              <span className="text-sm font-black w-5 text-center text-white">{qty}</span>
              <button
                onClick={handleAdd}
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-light hover:brightness-110 transition-all warm-button"
                aria-label={`Agregar ${nombre}`}
              >
                +
              </button>
            </div>
          )}
          <span className="text-xs" style={{ color: "var(--muted)" }}>{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {showAgregados && (
        <div className="border-t px-4 py-4" style={{ borderColor: "var(--line)", background: "rgba(8, 5, 4, 0.78)" }}>
          <p className="text-xs text-white mb-3 font-bold tracking-wide">Elige hasta 2 agregados</p>
          <div className="flex flex-col gap-2 mb-4">
            {AGREGADOS.map((a) => (
              <button
                key={a}
                onClick={() => toggleAgregado(a)}
                className="w-full text-left px-4 py-3 rounded-xl text-sm border transition-all"
                style={
                  seleccionados.includes(a)
                    ? { background: "var(--gold)", color: "#140803", borderColor: "var(--gold)", fontWeight: 800 }
                    : { background: "rgba(255,255,255,0.04)", borderColor: "var(--line)", color: "var(--paper)" }
                }
              >
                {a}
              </button>
            ))}
            <button
              onClick={() => setBebidaLata(!bebidaLata)}
              className="w-full text-left px-4 py-3 rounded-xl text-sm border transition-all"
              style={
                bebidaLata
                  ? { background: "var(--gold)", color: "#140803", borderColor: "var(--gold)", fontWeight: 800 }
                  : { background: "rgba(255,255,255,0.04)", borderColor: "var(--line)", color: "var(--paper)" }
              }
            >
              Agregar bebida lata +$1.200
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setShowAgregados(false); setSeleccionados([]); setBebidaLata(false) }}
              className="flex-1 py-3 rounded-xl text-sm border"
              style={{ borderColor: "var(--line)", color: "var(--muted)" }}
            >
              Cancelar
            </button>
            <button
              onClick={confirmarAgregados}
              className="flex-1 py-3 rounded-xl text-sm font-black transition-all hover:brightness-110 warm-button"
            >
              Agregar
            </button>
          </div>
        </div>
      )}

      {showSalchipapas && (
        <div className="border-t px-4 py-4" style={{ borderColor: "var(--line)", background: "rgba(8, 5, 4, 0.78)" }}>
          <p className="text-xs text-white mb-3 font-bold tracking-wide">Elige una opcion</p>
          <div className="flex flex-col gap-2 mb-4">
            {SALCHIPAPA_VARIANTES.map((variante) => (
              <button
                key={variante.id}
                onClick={() => confirmarSalchipapa(variante)}
                className="w-full flex justify-between gap-3 text-left px-4 py-3 rounded-xl text-sm border transition-all hover:bg-white/10"
                style={{ background: "rgba(255,255,255,0.04)", borderColor: "var(--line)", color: "var(--paper)" }}
              >
                <span className="font-bold">{variante.label}</span>
                <span style={{ color: "var(--gold)" }}>{variante.detail}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowSalchipapas(false)}
            className="w-full py-3 rounded-xl text-sm border"
            style={{ borderColor: "var(--line)", color: "var(--muted)" }}
          >
            Cancelar
          </button>
        </div>
      )}

      {expanded && !showAgregados && !showSalchipapas && (
        <div className="border-t" style={{ borderColor: "var(--line)" }}>
          {item.imagen_url ? (
            <img
              src={item.imagen_url}
              alt={nombre}
              className="w-full object-cover"
              style={{ maxHeight: "220px" }}
            />
          ) : null}
          <p className="text-sm leading-relaxed p-4" style={{ color: "var(--muted)" }}>{descripcion}</p>
        </div>
      )}
    </div>
  )
}
