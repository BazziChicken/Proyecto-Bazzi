export default function ItemCard({ item, qty, onAdd, onRemove }) {
  const fmt = (n) => "$" + n.toLocaleString("es-CL")

  return (
    <div className="border rounded-xl p-4 flex justify-between items-center gap-4" style={{ background: "#111111", borderColor: "#2a2a2a" }}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-white">{item.name}</span>
          {item.tags.includes("popular") && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#1f1a0e", color: "var(--gold)", border: "1px solid #3a2e10" }}>Popular</span>
          )}
          {item.tags.includes("veg") && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-950 text-green-400 border border-green-900">Vegano</span>
          )}
        </div>
        <p className="text-xs text-neutral-500 leading-relaxed truncate">{item.desc}</p>
        <p className="text-sm font-medium mt-2" style={{ color: "var(--gold)" }}>{fmt(item.price)}</p>
      </div>

      <div className="flex-shrink-0">
        {qty === 0 ? (
          <button
            onClick={() => onAdd(item)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-xl font-light transition-opacity hover:opacity-80"
            style={{ background: "var(--gold)", color: "#0a0a0a" }}
          >
            +
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => onRemove(item)}
              className="w-8 h-8 rounded-full border text-white flex items-center justify-center text-lg hover:bg-neutral-800 transition-colors"
              style={{ borderColor: "#404040" }}
            >
              -
            </button>
            <span className="text-sm font-medium w-4 text-center text-white">{qty}</span>
            <button
              onClick={() => onAdd(item)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-xl font-light hover:opacity-80 transition-opacity"
              style={{ background: "var(--gold)", color: "#0a0a0a" }}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  )
}