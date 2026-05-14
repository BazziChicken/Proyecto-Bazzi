export default function CartDesktop({ cart, onCheckout }) {
  const items = Object.values(cart)
  const total = items.reduce((sum, item) => sum + Number(item.precio || item.price) * item.qty, 0)
  const fmt = (n) => "$" + Number(n).toLocaleString("es-CL")

  return (
    <div className="sticky top-24 border rounded-xl overflow-hidden" style={{ background: "#111111", borderColor: "#2a2a2a" }}>
      <div className="px-5 py-4 border-b" style={{ borderColor: "#2a2a2a" }}>
        <span className="font-black text-lg tracking-widest" style={{ color: "var(--gold)" }}>Tu pedido</span>
      </div>

      <div className="px-5 py-4 flex flex-col gap-2 min-h-32">
        {items.length === 0 ? (
          <p className="text-xs text-neutral-600 text-center py-6">Agrega productos al carrito</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-neutral-400">{item.nombre || item.name} <span className="text-neutral-600">x{item.qty}</span></span>
              <span className="text-white font-medium">{fmt(Number(item.precio || item.price) * item.qty)}</span>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className="px-5 pb-5 border-t pt-4" style={{ borderColor: "#2a2a2a" }}>
          <div className="flex justify-between mb-4">
            <span className="text-sm text-neutral-400">Total</span>
            <span className="font-black text-base" style={{ color: "var(--gold)" }}>{fmt(total)}</span>
          </div>
          <button
            onClick={onCheckout}
            className="w-full rounded-xl py-3.5 text-sm font-semibold tracking-wide transition-opacity hover:opacity-85"
            style={{ background: "var(--gold)", color: "#0a0a0a" }}
          >
            Revisar pedido
          </button>
        </div>
      )}
    </div>
  )
}