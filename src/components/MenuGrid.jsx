import ItemCard from "./ItemCard"

export default function MenuGrid({ activeCategory, cart, onAdd, onRemove, menu, resultados, busqueda, onLimpiarBusqueda }) {
  const getItemQty = (item) => Object.values(cart).reduce(
    (sum, cartItem) => String(cartItem.id) === String(item.id) ? sum + cartItem.qty : sum,
    0
  )

  const renderItems = (items) => (
    <div className="flex flex-col gap-3.5">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          qty={getItemQty(item)}
          onAdd={onAdd}
          onRemove={onRemove}
        />
      ))}
    </div>
  )

  if (resultados) {
    const total = resultados.reduce((sum, section) => sum + section.items.length, 0)
    return (
      <main className="px-3 sm:px-4 py-5 pb-64">
        <div className="mb-4">
          <p className="text-xs tracking-[0.22em] uppercase" style={{ color: "var(--muted)" }}>
            {total === 1 ? "1 resultado" : `${total} resultados`}
          </p>
          <h2 className="font-display font-black text-2xl tracking-[0.04em] uppercase leading-tight text-white break-words">
            “{busqueda.trim()}”
          </h2>
        </div>

        {total === 0 ? (
          <div className="glass-panel rounded-2xl p-6 text-center">
            <p className="text-sm text-white font-semibold">No encontramos productos con ese nombre</p>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>Prueba con otra palabra, como “pollo” o “papas”.</p>
            <button
              onClick={onLimpiarBusqueda}
              className="mt-4 rounded-full px-5 py-2.5 text-sm font-black warm-button"
            >
              Ver todo el menú
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {resultados.map((section) => (
              <section key={section.category}>
                <h3 className="text-xs tracking-[0.18em] uppercase font-bold mb-2.5" style={{ color: "var(--gold)" }}>{section.category}</h3>
                {renderItems(section.items)}
              </section>
            ))}
          </div>
        )}
      </main>
    )
  }

  const section = menu.find((s) => s.category === activeCategory)
  if (!section) return null

  return (
    <main className="px-3 sm:px-4 py-5 pb-64">
      <div className="mb-4">
        <p className="text-xs tracking-[0.22em] uppercase" style={{ color: "var(--muted)" }}>Menú Bazzi</p>
        <h2 className="font-display font-black text-3xl tracking-[0.04em] uppercase leading-tight text-white">
          {section.category}
        </h2>
      </div>
      {renderItems(section.items)}
    </main>
  )
}
