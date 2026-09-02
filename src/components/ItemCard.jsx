import { useState } from "react"
import { getProductDecisions } from "../utils/productDecisions"

export default function ItemCard({ item, qty, onAdd, onRemove }) {
  const [expanded, setExpanded] = useState(false)
  const [showDecisiones, setShowDecisiones] = useState(false)
  const [seleccionados, setSeleccionados] = useState({})
  const [fotoExpandida, setFotoExpandida] = useState(false)

  const fmt = (n) => "$" + Number(n).toLocaleString("es-CL")
  const nombre = item.nombre || item.name
  const descripcion = item.descripcion || item.desc
  const precio = item.precio || item.price
  const tags = item.tags ? item.tags.split(",").map(t => t.trim()) : []
  const decisiones = getProductDecisions(item)

  const isSelected = (decision, option) => (seleccionados[decision.id] || []).includes(option.id)

  const toggleDecision = (decision, option) => {
    setSeleccionados((prev) => {
      const actuales = prev[decision.id] || []
      if (decision.tipo === "single") return { ...prev, [decision.id]: [option.id] }
      if (actuales.includes(option.id)) return { ...prev, [decision.id]: actuales.filter((id) => id !== option.id) }
      if (actuales.length >= decision.max) return prev
      return { ...prev, [decision.id]: [...actuales, option.id] }
    })
  }

  const getSelectedOptions = () => decisiones.flatMap((decision) => {
    const selectedIds = seleccionados[decision.id] || []
    return decision.opciones
      .filter((option) => selectedIds.includes(option.id))
      .map((option) => ({ ...option, decisionId: decision.id }))
  })

  const canConfirm = decisiones.every((decision) => !decision.requerido || (seleccionados[decision.id] || []).length > 0)

  const confirmarDecisiones = () => {
    if (!canConfirm) return
    const opciones = getSelectedOptions()
    const precioFinal = opciones.reduce((total, option) => (
      option.precioFinal !== null ? Number(option.precioFinal) : total + Number(option.precio || 0)
    ), Number(precio))
    const agregados = opciones.map((option) => option.cartLabel || option.nombre)
    const cartKey = `${item.id}:${opciones.map((option) => `${option.decisionId}-${option.id}`).join("|") || "sin-decisiones"}`
    onAdd({ ...item, precio: precioFinal, price: precioFinal, agregados, cartKey })
    setShowDecisiones(false)
    setSeleccionados({})
  }

  const getOptionDetail = (option) => {
    if (option.precioFinal !== null) return fmt(option.precioFinal)
    if (option.precio > 0) return `+${fmt(option.precio)}`
    return ""
  }

  const handleAdd = (e) => {
    e.stopPropagation()
    if (decisiones.length > 0) {
      setShowDecisiones(true)
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
              <span className="text-[11px] px-2 py-1 rounded-full font-bold" style={{ background: "rgba(157, 182, 127, 0.13)", color: "var(--sage)", border: "1px solid rgba(157, 182, 127, 0.3)" }}>Vegano</span>
            )}
            {item.stock > 0 && (
              <span className="text-[11px] px-2 py-1 rounded-full" style={{ background: "rgba(255, 244, 223, 0.07)", color: "var(--paper)", border: "1px solid rgba(255, 244, 223, 0.2)" }}>
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
          <svg
            width="14" height="14" viewBox="0 0 20 20" fill="none"
            style={{ color: "var(--muted)", transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}
          >
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {showDecisiones && (
        <div className="border-t px-4 py-4" style={{ borderColor: "var(--line)", background: "rgba(8, 5, 4, 0.78)" }}>
          {decisiones.map((decision) => (
            <div key={decision.id} className="mb-4 last:mb-4">
              <p className="text-xs text-white mb-3 font-bold tracking-wide">{decision.titulo}</p>
              <div className="flex flex-col gap-2">
                {decision.opciones.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => toggleDecision(decision, option)}
                    className="w-full flex justify-between gap-3 text-left px-4 py-3 rounded-xl text-sm border transition-all"
                    style={
                      isSelected(decision, option)
                        ? { background: "var(--gold)", color: "#140803", borderColor: "var(--gold)", fontWeight: 800 }
                        : { background: "rgba(255,255,255,0.04)", borderColor: "var(--line)", color: "var(--paper)" }
                    }
                  >
                    <span>{option.nombre}</span>
                    {getOptionDetail(option) && <span>{getOptionDetail(option)}</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="flex gap-2">
            <button
              onClick={() => { setShowDecisiones(false); setSeleccionados({}) }}
              className="flex-1 py-3 rounded-xl text-sm border"
              style={{ borderColor: "var(--line)", color: "var(--muted)" }}
            >
              Cancelar
            </button>
            <button
              onClick={confirmarDecisiones}
              disabled={!canConfirm}
              className="flex-1 py-3 rounded-xl text-sm font-black transition-all hover:brightness-110 disabled:opacity-40 warm-button"
            >
              Agregar
            </button>
          </div>
        </div>
      )}

      {expanded && !showDecisiones && (
        <div className="border-t" style={{ borderColor: "var(--line)" }}>
          {item.imagen_url && (
            <div className="relative">
              <img
                src={item.imagen_url}
                alt={nombre}
                className="w-full object-cover"
                style={{ maxHeight: "220px" }}
              />
              <button
                onClick={(e) => { e.stopPropagation(); setFotoExpandida(true) }}
                className="absolute bottom-2 right-2 text-xs px-3 py-1.5 rounded-full font-medium"
                style={{ background: "rgba(0,0,0,0.6)", color: "#ffffff" }}
              >
                Ver foto
              </button>
            </div>
          )}

          {fotoExpandida && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.9)" }}
              onClick={() => setFotoExpandida(false)}
            >
              <img src={item.imagen_url} alt={nombre} className="max-w-full max-h-full object-contain p-4" />
              <button
                className="absolute top-4 right-4 text-white text-2xl font-bold"
                onClick={() => setFotoExpandida(false)}
              >
                ×
              </button>
            </div>
          )}
          <p className="text-sm leading-relaxed p-4" style={{ color: "var(--muted)" }}>{descripcion}</p>
        </div>
      )}
    </div>
  )
}
