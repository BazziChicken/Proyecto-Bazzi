import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom"
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
import WhatsAppButton from "./components/WhatsAppButton"

const CART_STORAGE_KEY = "bazzi-cart"

const loadCart = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY))
    return saved && typeof saved === "object" ? saved : {}
  } catch {
    return {}
  }
}

const normalizar = (texto) => String(texto || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState("")
  const [busqueda, setBusqueda] = useState("")
  const [cart, setCart] = useState(loadCart)
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

        // Sacar del carrito guardado los productos que ya no están disponibles
        const disponibles = new Set(data.map((item) => String(item.id)))
        setCart((prev) => Object.fromEntries(
          Object.entries(prev).filter(([, item]) => disponibles.has(String(item.id)))
        ))
      }
      setLoading(false)
    }

    fetchMenu()
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch {
      // Sin almacenamiento disponible (modo incógnito, etc.): el carrito solo vive en memoria
    }
  }, [cart])

  const cartCount = Object.values(cart).reduce((sum, item) => sum + item.qty, 0)

  const getCartKey = (item) => item.cartKey || String(item.id)

  const handleAdd = (item) => {
    const cartKey = getCartKey(item)
    setCart((prev) => ({
      ...prev,
      [cartKey]: { ...item, cartKey, qty: (prev[cartKey]?.qty || 0) + 1 }
    }))
  }

  const handleRemove = (item) => {
    setCart((prev) => {
      const cartKey = item.cartKey || Object.keys(prev).find((key) => String(prev[key].id) === String(item.id))
      if (!cartKey) return prev

      const qty = (prev[cartKey]?.qty || 0) - 1
      if (qty <= 0) {
        const next = { ...prev }
        delete next[cartKey]
        return next
      }
      return { ...prev, [cartKey]: { ...prev[cartKey], qty } }
    })
  }

  const handleCategory = (category) => {
    setActiveCategory(category)
    setBusqueda("")
    window.scrollTo(0, 0)
  }

  const termino = normalizar(busqueda.trim())
  // Productos cuyo nombre coincide van antes que los que solo coinciden en la descripción
  const puntaje = (item, category) => {
    if (normalizar(item.nombre || item.name).includes(termino)) return 2
    if (normalizar(category).includes(termino)) return 1
    return normalizar(item.descripcion || item.desc).includes(termino) ? 0 : -1
  }
  const resultados = termino
    ? menuDB
        .map((section) => {
          const items = section.items
            .map((item) => ({ item, score: puntaje(item, section.category) }))
            .filter(({ score }) => score >= 0)
            .sort((a, b) => b.score - a.score)
          return { ...section, items: items.map(({ item }) => item), mejor: items[0]?.score ?? -1 }
        })
        .filter((section) => section.items.length > 0)
        .sort((a, b) => b.mejor - a.mejor)
    : null

  const goCheckout = () => navigate("/pedido")

  const cargando = (
    <div className="min-h-screen flex items-center justify-center app-surface">
      <span className="text-sm tracking-widest" style={{ color: "var(--muted)" }}>Cargando menú...</span>
    </div>
  )

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={
          <Inicio onVerMenu={() => navigate("/menu")} onEspecial={() => navigate("/especial")} />
        } />
        <Route path="/menu" element={loading ? cargando : (
          <div className="min-h-screen relative app-surface">
            <div className="relative" style={{ zIndex: 1 }}>
              <Header
                activeCategory={activeCategory}
                setActiveCategory={handleCategory}
                cartCount={cartCount}
                onCart={goCheckout}
                onInfo={() => navigate("/info")}
                menu={menuDB}
                onInicio={() => navigate("/")}
                busqueda={busqueda}
                setBusqueda={setBusqueda}
              />

              <div className="max-w-7xl mx-auto px-4 lg:flex lg:gap-8 lg:pt-6">
                <div className="lg:flex-1">
                  <MenuGrid
                    activeCategory={activeCategory}
                    cart={cart}
                    onAdd={handleAdd}
                    onRemove={handleRemove}
                    menu={menuDB}
                    resultados={resultados}
                    busqueda={busqueda}
                    onLimpiarBusqueda={() => setBusqueda("")}
                  />
                </div>
                <div className="hidden lg:block lg:w-80">
                  <CartDesktop cart={cart} onCheckout={goCheckout} />
                </div>
              </div>
            </div>

            <div className="lg:hidden">
              <Cart cart={cart} onCheckout={goCheckout} />
            </div>
            {cartCount === 0 && <WhatsAppButton />}
          </div>
        )} />
        <Route path="/pedido" element={cartCount === 0 ? <Navigate to="/menu" replace /> : (
          <Checkout cart={cart} onBack={() => navigate("/menu")} onAdd={handleAdd} onRemove={handleRemove} />
        )} />
        <Route path="/info" element={<><Info onBack={() => navigate("/menu")} /><WhatsAppButton /></>} />
        <Route path="/especial" element={<><Especial onBack={() => navigate("/")} /><WhatsAppButton /></>} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
