import { menu } from "../data/menu"
import ItemCard from "./ItemCard"

export default function MenuGrid({ activeCategory, cart, onAdd, onRemove }) {
  const section = menu.find((s) => s.category === activeCategory)
  if (!section) return null

  return (
    <main className="px-4 py-5 pb-64">
      <h2 className="font-black text-2xl tracking-widest mb-4 uppercase" style={{ color: "#ffffff" }}>
        {section.category}
      </h2>
      <div className="flex flex-col gap-3">
        {section.items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            qty={cart[item.id]?.qty || 0}
            onAdd={onAdd}
            onRemove={onRemove}
          />
        ))}
      </div>
    </main>
  )
}