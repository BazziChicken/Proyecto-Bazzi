export default function Cart({ cart, onCheckout }) {
  const items = Object.values(cart)
  const total = items.reduce((sum, item) => sum + Number(item.precio || item.price) * item.qty, 0)
  const fmt = (n) => "$" + Number(n).toLocaleString("es-CL")

  if (items.length === 0) return null

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 border-t flex flex-col rounded-t-3xl safe-bottom" style={{ background: "rgba(8, 5, 4, 0.96)", borderColor: "var(--line)", maxHeight: "34vh", boxShadow: "0 -20px 46px rgba(0,0,0,0.45)" }}>
      <div className="px-5 pt-4 flex justify-between items-end flex-shrink-0">
        <div>
          <span className="block text-xs tracking-[0.18em] uppercase" style={{ color: "var(--muted)" }}>
            Tu pedido
          </span>
          <span className="text-sm text-white">
            {items.reduce((s, i) => s + i.qty, 0)} productos
          </span>
        </div>
        <span className="font-black text-2xl tracking-wide" style={{ color: "var(--gold)" }}>{fmt(total)}</span>
      </div>

      <div className="px-5 py-3 flex flex-col gap-1.5 overflow-y-auto flex-1 scrollbar-hide">
        {items.map((item) => (
          <div key={item.cartKey || item.id} className="flex justify-between text-sm gap-3">
            <span className="truncate" style={{ color: "var(--muted)" }}>
              {item.nombre || item.name}
              {item.agregados && item.agregados.length > 0 && (
              <span style={{ color: "#7d7065" }}> · {item.agregados.join(", ")}</span>
            )}
            <span style={{ color: "#7d7065" }}> x{item.qty}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="px-5 pb-1 flex-shrink-0">
        <button
          onClick={onCheckout}
          className="w-full rounded-2xl py-4 text-sm font-black tracking-wide transition-all hover:brightness-110 warm-button"
        >
          Revisar pedido
        </button>
      </div>
    </div>
  )
}
