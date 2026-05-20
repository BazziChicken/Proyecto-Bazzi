import { useState } from "react"

const AGREGADOS = ["Arroz", "Papas fritas", "Ensalada"]

export default function ItemCard({ item, qty, onAdd, onRemove }) {
  const [expanded, setExpanded] = useState(true)
  const [showAgregados, setShowAgregados] = useState(false)
  const [seleccionados, setSeleccionados] = useState([])

  const fmt = (n) => "$" + Number(n).toLocaleString("es-CL")
  const nombre = item.nombre || item.name
  const descripcion = item.descripcion || item.desc
  const precio = item.precio || item.price
  const tags = item.tags ? item.tags.split(",").map(t => t.trim()) : []
  const esColacion = item.categoria === "Colaciones"

  const toggleAgregado = (a) => {
    if (seleccionados.includes(a)) {
      setSeleccionados(seleccionados.filter(s => s !== a))
    } else {
      if (seleccionados.length >= 2) return
      setSeleccionados([...seleccionados, a])
    }
  }

  const confirmarAgregados = () => {
    const itemConAgregados = { ...item, agregados: seleccionados }
    onAdd(itemConAgregados)
    setShowAgregados(false)
    setSeleccionados([])
  }

  const handleAdd = (e) => {
    e.stopPropagation()
    if (esColacion && qty === 0) {
      setShowAgregados(true)
    } else {
      onAdd(item)
    }
  }

  return (
    <div className="border rounded-xl overflow-hidden" style={{ background: "#111111", borderColor: "#2a2a2a" }}>

      <div
        className="p-4 flex justify-between items-center gap-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-sm font-medium text-white">{nombre}</span>
            {tags.includes("popular") && (
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#1f1a0e", color: "var(--gold)", border: "1px solid #3a2e10" }}>Popular</span>
            )}
            {tags.includes("veg") && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-950 text-green-400 border border-green-900">Vegano</span>
            )}
            {item.stock > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#0f1f2a", color: "#60a5fa", border: "1px solid #1e3a4a" }}>
                Stock: {item.stock}
              </span>
            )}
          </div>
          {!expanded && (
            <p className="text-xs text-neutral-500 leading-relaxed truncate">{descripcion}</p>
          )}
          <p className="text-sm font-medium mt-2" style={{ color: "var(--gold)" }}>{fmt(precio)}</p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {qty === 0 ? (
            <button
              onClick={handleAdd}
              className="w-8 h-8 rounded-full flex items-center justify-center text-xl font-light transition-opacity hover:opacity-80"
              style={{ background: "var(--gold)", color: "#0a0a0a" }}
            >
              +
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => { e.stopPropagation(); onRemove(item) }}
                className="w-8 h-8 rounded-full border text-white flex items-center justify-center text-lg hover:bg-neutral-800 transition-colors"
                style={{ borderColor: "#404040" }}
              >
                -
              </button>
              <span className="text-sm font-medium w-4 text-center text-white">{qty}</span>
              <button
                onClick={handleAdd}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xl font-light hover:opacity-80 transition-opacity"
                style={{ background: "var(--gold)", color: "#0a0a0a" }}
              >
                +
              </button>
            </div>
          )}
          <span className="text-neutral-600 text-xs">{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {/* Modal selección de agregados */}
      {showAgregados && (
        <div className="border-t px-4 py-4" style={{ borderColor: "#2a2a2a", background: "#0a0a0a" }}>
          <p className="text-xs text-white mb-3 font-medium">Elige hasta 2 agregados:</p>
          <div className="flex flex-col gap-2 mb-4">
            {AGREGADOS.map((a) => (
              <button
                key={a}
                onClick={() => toggleAgregado(a)}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm border transition-all"
                style={
                  seleccionados.includes(a)
                    ? { background: "var(--gold)", color: "#0a0a0a", borderColor: "var(--gold)", fontWeight: 600 }
                    : { background: "#111111", borderColor: "#2a2a2a", color: "#a3a3a3" }
                }
              >
                {a}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setShowAgregados(false); setSeleccionados([]) }}
              className="flex-1 py-2.5 rounded-xl text-sm border"
              style={{ borderColor: "#404040", color: "#a3a3a3" }}
            >
              Cancelar
            </button>
            <button
              onClick={confirmarAgregados}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-85"
              style={{ background: "var(--gold)", color: "#0a0a0a" }}
            >
              Agregar
            </button>
          </div>
        </div>
      )}

      {expanded && !showAgregados && (
        <div className="border-t" style={{ borderColor: "#2a2a2a" }}>
          {item.imagen_url ? (
            <img
              src={item.imagen_url}
              alt={nombre}
              className="w-full object-cover"
              style={{ maxHeight: "200px" }}
            />
          ) : null}
          <p className="text-xs text-neutral-400 leading-relaxed p-4">{descripcion}</p>
        </div>
      )}

    </div>
  )
}