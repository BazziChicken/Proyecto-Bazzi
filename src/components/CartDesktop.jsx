export default function CartDesktop({ cart, onCheckout }) {
  const items = Object.values(cart)
  const total = items.reduce((sum, item) => sum + Number(item.precio || item.price) * item.qty, 0)
  const fmt = (n) => "$" + Number(n).toLocaleString("es-CL")

  return (
    <div className="sticky top-28 glass-panel rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b" style={{ borderColor: "var(--line)" }}>
        <span className="font-black text-lg tracking-widest" style={{ color: "var(--gold)" }}>Tu pedido</span>
      </div>

      <div className="px-5 py-4 flex flex-col gap-2 min-h-32">
        {items.length === 0 ? (
          <p className="text-xs text-center py-6" style={{ color: "var(--muted)" }}>Agrega productos al carrito</p>
        ) : (
          items.map((item) => (
            <div key={item.cartKey || item.id} className="flex justify-between text-sm">
              <span style={{ color: "var(--muted)" }}>
                {item.nombre || item.name}
                {item.agregados && item.agregados.length > 0 && (
                  <span className="block text-xs" style={{ color: "#7d7065" }}>{item.agregados.join(", ")}</span>
                )}
                <span style={{ color: "#7d7065" }}> x{item.qty}</span>
              </span>
              <span className="text-white font-medium">{fmt(Number(item.precio || item.price) * item.qty)}</span>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className="px-5 pb-5 border-t pt-4" style={{ borderColor: "var(--line)" }}>
          <div className="flex justify-between mb-4">
            <span className="text-sm text-neutral-400">Total</span>
            <span className="font-black text-base" style={{ color: "var(--gold)" }}>{fmt(total)}</span>
          </div>
          <button
            onClick={onCheckout}
            className="w-full rounded-2xl py-3.5 text-sm font-black tracking-wide transition-all hover:brightness-110 warm-button"
          >
            Revisar pedido
          </button>
        </div>
      )}
    </div>
  )
}
