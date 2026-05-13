import { useState } from "react"
import { menu } from "./data/menu"
import Header from "./components/Header"
import MenuGrid from "./components/MenuGrid"
import Cart from "./components/Cart"
import Checkout from "./components/Checkout"
import Info from "./components/Info"
import mezquita from "./assets/mezquita.png"
import columna from "./assets/columna.png"


export default function App() {
  const [activeCategory, setActiveCategory] = useState(menu[0].category)
  const [cart, setCart] = useState({})
  const [showCheckout, setShowCheckout] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const cartCount = Object.values(cart).reduce((sum, item) => sum + item.qty, 0)

  const handleAdd = (item) => {
    setCart((prev) => ({
      ...prev,
      [item.id]: { ...item, qty: (prev[item.id]?.qty || 0) + 1 }
    }))
  }

  const handleRemove = (item) => {
    setCart((prev) => {
      const qty = (prev[item.id]?.qty || 0) - 1
      if (qty <= 0) {
        const next = { ...prev }
        delete next[item.id]
        return next
      }
      return { ...prev, [item.id]: { ...prev[item.id], qty } }
    })
  }

  if (showInfo) return <Info onBack={() => setShowInfo(false)} />
  if (showCheckout) return <Checkout cart={cart} onBack={() => setShowCheckout(false)} />

  return (
  <div className="min-h-screen max-w-md mx-auto relative overflow-hidden" style={{ background: "#0a0a0a" }}>


    {/* Mezquita fondo */}
    <img
      src={mezquita}
      alt=""
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full pointer-events-none select-none"
      style={{ opacity: 0.5, zIndex: 0 }}
    />

    {/* Columna abajo espejada */}
    <img
      src={columna}
      alt=""
      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full pointer-events-none select-none"
      style={{ opacity: 0.50, zIndex: 0, transform: "translateX(-50%) scaleY(-1)" }}
    />

    {/* Contenido */}
    <div className="relative" style={{ zIndex: 1 }}>
      <Header
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        cartCount={cartCount}
        onInfo={() => setShowInfo(true)}
      />
      <MenuGrid
        activeCategory={activeCategory}
        cart={cart}
        onAdd={handleAdd}
        onRemove={handleRemove}
      />
      <Cart cart={cart} onCheckout={() => setShowCheckout(true)} />
    </div>

  </div>
)
}