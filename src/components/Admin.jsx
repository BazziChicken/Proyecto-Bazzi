import { useState, useEffect } from "react"
import { supabase } from "../supabase"

function Login({ onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setLoading(true)
    setError("")
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError("Credenciales incorrectas")
    } else {
      onLogin()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col items-center justify-center px-6" style={{ background: "#0a0a0a" }}>
      <div className="font-black text-3xl tracking-widest mb-1" style={{ color: "var(--gold)" }}>BAZZI</div>
      <div className="text-xs tracking-widest text-neutral-500 mb-10">PANEL DE ADMINISTRACIÓN</div>

      <div className="w-full flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none border"
          style={{ background: "#111111", borderColor: "#2a2a2a" }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none border"
          style={{ background: "#111111", borderColor: "#2a2a2a" }}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full rounded-xl py-3.5 text-sm font-semibold tracking-wide transition-opacity hover:opacity-85"
          style={{ background: "var(--gold)", color: "#0a0a0a" }}
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </div>
    </div>
  )
}

function Panel() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState(null)
  const [nuevo, setNuevo] = useState(false)
  const [form, setForm] = useState({ nombre: "", descripcion: "", precio: "", categoria: "", tags: "", disponible: true, orden: 0 })
  const [subiendo, setSubiendo] = useState(false)

  const fetchProductos = async () => {
    const { data } = await supabase.from("productos").select("*").order("orden")
    setProductos(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchProductos() }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const handleGuardar = async () => {
  const dataToSave = {
    ...form,
    stock: form.stock === "" ? null : Number(form.stock)
  }
  
  if (editando) {
    await supabase.from("productos").update(dataToSave).eq("id", editando)
  } else {
    await supabase.from("productos").insert(dataToSave)
  }
  setEditando(null)
  setNuevo(false)
  setForm({ nombre: "", descripcion: "", precio: "", categoria: "", tags: "", disponible: true, orden: 0, imagen_url: "", stock: "" })
  fetchProductos()
}

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return
    await supabase.from("productos").delete().eq("id", id)
    fetchProductos()
  }

  const handleToggle = async (id, actual) => {
    await supabase.from("productos").update({ disponible: !actual }).eq("id", id)
    fetchProductos()
  }

  const handleImagen = async (e, id) => {
    const file = e.target.files[0]
    if (!file) return
    setSubiendo(true)
    const ext = file.name.split(".").pop()
    const path = `producto-${id || Date.now()}.${ext}`
    await supabase.storage.from("productos").upload(path, file, { upsert: true })
    const { data } = supabase.storage.from("productos").getPublicUrl(path)
    setForm((prev) => ({ ...prev, imagen_url: data.publicUrl }))
    setSubiendo(false)
  }

  const abrirEditar = (p) => {
    setEditando(p.id)
    setNuevo(false)
    setForm({ nombre: p.nombre, descripcion: p.descripcion, precio: p.precio, categoria: p.categoria, tags: p.tags || "", disponible: p.disponible, orden: p.orden || 0, imagen_url: p.imagen_url || "", stock: p.stock || ""})
  }

  const abrirNuevo = () => {
    setNuevo(true)
    setEditando(null)
    setForm({ nombre: "", descripcion: "", precio: "", categoria: "", tags: "", disponible: true, orden: 0, imagen_url: "", stock: "" })
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}><span className="text-neutral-500 text-sm">Cargando...</span></div>

  if (editando || nuevo) return (
    <div className="min-h-screen max-w-md mx-auto px-5 py-6" style={{ background: "#0a0a0a" }}>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => { setEditando(null); setNuevo(false) }} className="text-xs border rounded-full px-3 py-1.5" style={{ borderColor: "#404040", color: "#a3a3a3" }}>Volver</button>
        <span className="font-black text-xl tracking-widest" style={{ color: "var(--gold)" }}>{nuevo ? "Nuevo producto" : "Editar producto"}</span>
      </div>

      <div className="flex flex-col gap-3">
        {[
          { label: "Nombre", key: "nombre" },
          { label: "Descripción", key: "descripcion" },
          { label: "Precio", key: "precio", type: "number" },
          { label: "Categoría", key: "categoria" },
          { label: "Tags (popular, veg)", key: "tags" },
          { label: "Orden", key: "orden", type: "number" },
          { label: "Stock", key: "stock", type: "number" },
        ].map(({ label, key, type }) => (
          <div key={key} className="flex flex-col gap-1">
            <label className="text-xs tracking-widest text-neutral-400 uppercase">{label}</label>
            <input
              type={type || "text"}
              value={form[key]}
              onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
              className="rounded-xl px-4 py-3 text-sm text-white outline-none border"
              style={{ background: "#111111", borderColor: "#2a2a2a" }}
            />
          </div>
        ))}

        <div className="flex flex-col gap-1">
          <label className="text-xs tracking-widest text-neutral-400 uppercase">Imagen</label>
          {form.imagen_url && <img src={form.imagen_url} alt="" className="w-full rounded-xl object-cover mb-2" style={{ maxHeight: "160px" }} />}
          <input type="file" accept="image/*" onChange={(e) => handleImagen(e, editando)} className="text-xs text-neutral-400" />
          {subiendo && <span className="text-xs text-neutral-500">Subiendo imagen...</span>}
        </div>

        <div className="flex items-center gap-3 mt-1">
          <label className="text-xs tracking-widest text-neutral-400 uppercase">Disponible</label>
          <button
            onClick={() => setForm((prev) => ({ ...prev, disponible: !prev.disponible }))}
            className="rounded-full px-4 py-1.5 text-xs font-medium border transition-all"
            style={form.disponible ? { background: "var(--gold)", color: "#0a0a0a", borderColor: "var(--gold)" } : { borderColor: "#404040", color: "#a3a3a3" }}
          >
            {form.disponible ? "Sí" : "No"}
          </button>
        </div>

        <button
          onClick={handleGuardar}
          className="w-full rounded-xl py-3.5 text-sm font-semibold tracking-wide mt-2 transition-opacity hover:opacity-85"
          style={{ background: "var(--gold)", color: "#0a0a0a" }}
        >
          Guardar
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen max-w-md mx-auto px-5 py-6" style={{ background: "#0a0a0a" }}>
      <div className="flex justify-between items-center mb-6">
        <span className="font-black text-xl tracking-widest" style={{ color: "var(--gold)" }}>Productos</span>
        <div className="flex gap-2">
          <button onClick={abrirNuevo} className="text-xs border rounded-full px-3 py-1.5" style={{ borderColor: "var(--gold)", color: "var(--gold)" }}>+ Nuevo</button>
          <button onClick={handleLogout} className="text-xs border rounded-full px-3 py-1.5" style={{ borderColor: "#404040", color: "#a3a3a3" }}>Salir</button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {productos.map((p) => (
          <div key={p.id} className="border rounded-xl p-4" style={{ background: "#111111", borderColor: "#2a2a2a" }}>
            <div className="flex justify-between items-start gap-2 mb-1">
              <span className="text-sm font-medium text-white">{p.nombre}</span>
              <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={p.disponible ? { background: "#0f2a0f", color: "#4ade80" } : { background: "#2a0f0f", color: "#f87171" }}>
                {p.disponible ? "Activo" : "Inactivo"}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mb-1">{p.categoria}</p>
            <p className="text-sm font-medium mb-3" style={{ color: "var(--gold)" }}>${Number(p.precio).toLocaleString("es-CL")}</p>
            <div className="flex gap-2">
              <button onClick={() => abrirEditar(p)} className="text-xs border rounded-full px-3 py-1.5 flex-1" style={{ borderColor: "#404040", color: "#a3a3a3" }}>Editar</button>
              <button onClick={() => handleToggle(p.id, p.disponible)} className="text-xs border rounded-full px-3 py-1.5 flex-1" style={{ borderColor: "#404040", color: "#a3a3a3" }}>{p.disponible ? "Desactivar" : "Activar"}</button>
              <button onClick={() => handleEliminar(p.id)} className="text-xs border rounded-full px-3 py-1.5" style={{ borderColor: "#7f1d1d", color: "#f87171" }}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Admin() {
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChecking(false)
    })
    supabase.auth.onAuthStateChange((_e, session) => setSession(session))
  }, [])

  if (checking) return null
  if (!session) return <Login onLogin={() => supabase.auth.getSession().then(({ data }) => setSession(data.session))} />
  return <Panel />
}