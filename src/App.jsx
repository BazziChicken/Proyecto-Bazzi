import { Routes, Route } from "react-router-dom"
import { useState, useEffect } from "react"
import { supabase } from "./supabase"
import Admin from "./components/Admin"
import Header from "./components/Header"
import MenuGrid from "./components/MenuGrid"
import Cart from "./components/Cart"
import CartDesktop from "./components/CartDesktop"
import Checkout from "./components/Checkout"
import Info from "./components/Info"
import Especial from "./components/Especial"
import Inicio from "./components/Inicio"

export default function App() {
  const [showInicio, setShowInicio] = useState(true)
  const [activeCategory, setActiveCategory] = useState("")
  const [cart, setCart] = useState({})
  const [showCheckout, setShowCheckout] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [showEspecial, setShowEspecial] = useState(false)
  const [menuDB, setMenuDB] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase
      .from("productos")
      .select("*")
      .eq("disponible", true)
      .or("stock.gt.0,stock.is.null")
      .order("orden", { ascending: true })

      if (error) {
        console.error(error)
      } else {
        const agrupado = data.reduce((acc, item) => {
          const cat = acc.find((c) => c.category === item.categoria)
          if (cat) {
            cat.items.push(item)
          } else {
            acc.push({ category: item.categoria, items: [item] })
          }
          return acc
        }, [])
        setMenuDB(agrupado)
        if (agrupado.length > 0) setActiveCategory(agrupado[0].category)
      }
      setLoading(false)
    }

    fetchMenu()
  }, [])

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "radial-gradient(ellipse at top, #2d1200 0%, #0a0a0a 50%)" }}>
      <span className="text-sm tracking-widest text-neutral-500">Cargando menú...</span>
    </div>
  )

  if (showInicio) return <Inicio onVerMenu={() => setShowInicio(false)} onEspecial={() => { setShowInicio(false); setShowEspecial(true) }} />
  if (showInfo) return <Info onBack={() => setShowInfo(false)} />
  if (showEspecial) return <Especial onBack={() => setShowEspecial(false)} />
  if (showCheckout) return <Checkout cart={cart} onBack={() => setShowCheckout(false)} onAdd={handleAdd} onRemove={handleRemove} />
  if (showInicio) return <Inicio onVerMenu={() => setShowInicio(false)} onEspecial={() => setShowEspecial(true)} />

  return (
    <Routes>
      <Route path="/" element={
       <div className="min-h-screen relative" style={{ background: "radial-gradient(ellipse at top, #2d1200 0%, #0a0a0a 50%)" }}>
          <div className="relative" style={{ zIndex: 1 }}>
            <Header
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              cartCount={cartCount}
              onInfo={() => setShowInfo(true)}
              menu={menuDB}
              onInicio={() => setShowInicio(true)}
            />

            <div className="max-w-7xl mx-auto px-4 lg:flex lg:gap-8 lg:pt-6">
              <div className="lg:flex-1">
                <MenuGrid activeCategory={activeCategory} cart={cart} onAdd={handleAdd} onRemove={handleRemove} menu={menuDB} />
              </div>
              <div className="hidden lg:block lg:w-80">
                <CartDesktop cart={cart} onCheckout={() => setShowCheckout(true)} />
              </div>
            </div>
          </div>

          <div className="lg:hidden">
            <Cart cart={cart} onCheckout={() => setShowCheckout(true)} />
          </div>
        </div>
      } />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}