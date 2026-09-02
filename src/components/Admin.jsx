import { useState, useEffect } from "react"
import { supabase } from "../supabase"
import { cleanDecisiones, hasConfiguredDecisions } from "../utils/productDecisions"

const emptyDecision = () => ({
  titulo: "",
  tipo: "multiple",
  max: 1,
  requerido: false,
  opciones: [{ nombre: "", precio: "", precioFinal: "" }]
})

const normalizeFormDecisiones = (value) => {
  if (Array.isArray(value)) return value
  if (!value) return []
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

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
    <div className="min-h-screen max-w-md mx-auto flex flex-col items-center justify-center px-6 app-surface">
      <div className="font-display font-black text-3xl tracking-widest mb-1" style={{ color: "var(--gold)" }}>BAZZI</div>
      <div className="text-xs tracking-widest text-neutral-500 mb-10">PANEL DE ADMINISTRACIÓN</div>

      <div className="w-full flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none border"
          style={{ background: "rgba(255,255,255,0.04)", borderColor: "var(--line)" }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none border"
          style={{ background: "rgba(255,255,255,0.04)", borderColor: "var(--line)" }}
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
  const [busqueda, setBusqueda] = useState("")
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState(null)
  const [nuevo, setNuevo] = useState(false)
  const [form, setForm] = useState({ nombre: "", descripcion: "", precio: "", categoria: "", tags: "", disponible: true, orden: 0, imagen_url: "", stock: "", decisiones: [] })
  const [subiendo, setSubiendo] = useState(false)

  const fetchProductos = async () => {
    const { data } = await supabase.from("productos").select("*").order("orden")
    setProductos(data || [])
    setLoading(false)
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchProductos() }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const handleGuardar = async () => {
  const dataToSave = {
    ...form,
    stock: form.stock === "" ? null : Number(form.stock),
    decisiones: cleanDecisiones(form.decisiones)
  }
  
  if (editando) {
    const { error } = await supabase.from("productos").update(dataToSave).eq("id", editando)
    if (error) { alert(`No se pudo guardar: ${error.message}`); return }
  } else {
    const { error } = await supabase.from("productos").insert(dataToSave)
    if (error) { alert(`No se pudo guardar: ${error.message}`); return }
  }
  setEditando(null)
  setNuevo(false)
  setForm({ nombre: "", descripcion: "", precio: "", categoria: "", tags: "", disponible: true, orden: 0, imagen_url: "", stock: "", decisiones: [] })
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
    setForm({ nombre: p.nombre, descripcion: p.descripcion, precio: p.precio, categoria: p.categoria, tags: p.tags || "", disponible: p.disponible, orden: p.orden || 0, imagen_url: p.imagen_url || "", stock: p.stock || "", decisiones: normalizeFormDecisiones(p.decisiones)})
  }

  const abrirNuevo = () => {
    setNuevo(true)
    setEditando(null)
    setForm({ nombre: "", descripcion: "", precio: "", categoria: "", tags: "", disponible: true, orden: 0, imagen_url: "", stock: "", decisiones: [] })
  }

  const updateDecision = (index, key, value) => {
    setForm((prev) => ({
      ...prev,
      decisiones: prev.decisiones.map((decision, i) => i === index ? { ...decision, [key]: value } : decision)
    }))
  }

  const updateDecisionOption = (decisionIndex, optionIndex, key, value) => {
    setForm((prev) => ({
      ...prev,
      decisiones: prev.decisiones.map((decision, i) => {
        if (i !== decisionIndex) return decision
        return {
          ...decision,
          opciones: decision.opciones.map((option, j) => j === optionIndex ? { ...option, [key]: value } : option)
        }
      })
    }))
  }

  const addDecision = () => {
    setForm((prev) => ({ ...prev, decisiones: [...prev.decisiones, emptyDecision()] }))
  }

  const removeDecision = (index) => {
    setForm((prev) => ({ ...prev, decisiones: prev.decisiones.filter((_, i) => i !== index) }))
  }

  const addDecisionOption = (decisionIndex) => {
    setForm((prev) => ({
      ...prev,
      decisiones: prev.decisiones.map((decision, i) => i === decisionIndex
        ? { ...decision, opciones: [...decision.opciones, { nombre: "", precio: "", precioFinal: "" }] }
        : decision
      )
    }))
  }

  const removeDecisionOption = (decisionIndex, optionIndex) => {
    setForm((prev) => ({
      ...prev,
      decisiones: prev.decisiones.map((decision, i) => i === decisionIndex
        ? { ...decision, opciones: decision.opciones.filter((_, j) => j !== optionIndex) }
        : decision
      )
    }))
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center app-surface"><span className="text-neutral-500 text-sm">Cargando...</span></div>

  if (editando || nuevo) return (
    <div className="min-h-screen max-w-md mx-auto px-5 py-6 app-surface">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => { setEditando(null); setNuevo(false) }} className="text-xs border rounded-full px-3 py-1.5" style={{ borderColor: "var(--line)", color: "var(--muted)" }}>Volver</button>
        <span className="font-display font-black text-xl tracking-widest" style={{ color: "var(--gold)" }}>{nuevo ? "Nuevo producto" : "Editar producto"}</span>
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
              style={{ background: "rgba(255,255,255,0.04)", borderColor: "var(--line)" }}
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
            style={form.disponible ? { background: "var(--gold)", color: "#0a0a0a", borderColor: "var(--gold)" } : { borderColor: "var(--line)", color: "var(--muted)" }}
          >
            {form.disponible ? "Sí" : "No"}
          </button>
        </div>

        <div className="border rounded-2xl p-4 mt-2" style={{ borderColor: "var(--line)", background: "#0f0f0f" }}>
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <label className="text-xs tracking-widest text-neutral-400 uppercase">Decisiones</label>
              <p className="text-xs text-neutral-500 mt-1">Opciones que aparecen al tocar + en el menu.</p>
            </div>
            <button
              onClick={addDecision}
              className="text-xs border rounded-full px-3 py-1.5 flex-shrink-0"
              style={{ borderColor: "var(--gold)", color: "var(--gold)" }}
            >
              + Grupo
            </button>
          </div>

          {form.decisiones.length === 0 ? (
            <p className="text-xs text-neutral-500">Sin decisiones configuradas.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {form.decisiones.map((decision, decisionIndex) => (
                <div key={decisionIndex} className="border rounded-xl p-3" style={{ borderColor: "var(--line)", background: "rgba(255,255,255,0.04)" }}>
                  <div className="flex justify-between gap-2 mb-3">
                    <input
                      type="text"
                      placeholder="Titulo del grupo"
                      value={decision.titulo}
                      onChange={(e) => updateDecision(decisionIndex, "titulo", e.target.value)}
                      className="min-w-0 flex-1 rounded-xl px-3 py-2 text-xs text-white outline-none border"
                      style={{ background: "#0a0a0a", borderColor: "var(--line)" }}
                    />
                    <button
                      onClick={() => removeDecision(decisionIndex)}
                      className="text-xs border rounded-full px-3"
                      style={{ borderColor: "#7f1d1d", color: "#f87171" }}
                    >
                      Quitar
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <button
                      onClick={() => updateDecision(decisionIndex, "tipo", decision.tipo === "single" ? "multiple" : "single")}
                      className="rounded-xl min-h-10 text-xs border"
                      style={{ borderColor: "var(--line)", color: "#d4d4d4" }}
                    >
                      {decision.tipo === "single" ? "Una opcion" : "Varias opciones"}
                    </button>
                    <input
                      type="number"
                      min="1"
                      disabled={decision.tipo === "single"}
                      placeholder="Max"
                      value={decision.tipo === "single" ? 1 : decision.max}
                      onChange={(e) => updateDecision(decisionIndex, "max", e.target.value)}
                      className="rounded-xl px-3 py-2 text-xs text-white outline-none border disabled:opacity-40"
                      style={{ background: "#0a0a0a", borderColor: "var(--line)" }}
                    />
                  </div>

                  <button
                    onClick={() => updateDecision(decisionIndex, "requerido", !decision.requerido)}
                    className="rounded-full px-3 py-1.5 text-xs border mb-3"
                    style={decision.requerido ? { background: "var(--gold)", color: "#0a0a0a", borderColor: "var(--gold)" } : { borderColor: "var(--line)", color: "var(--muted)" }}
                  >
                    {decision.requerido ? "Obligatorio" : "Opcional"}
                  </button>

                  <div className="flex flex-col gap-2">
                    {decision.opciones.map((option, optionIndex) => (
                      <div key={optionIndex} className="grid grid-cols-[1fr_78px_78px_auto] gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Opcion"
                          value={option.nombre}
                          onChange={(e) => updateDecisionOption(decisionIndex, optionIndex, "nombre", e.target.value)}
                          className="min-w-0 rounded-xl px-3 py-2 text-xs text-white outline-none border"
                          style={{ background: "#0a0a0a", borderColor: "var(--line)" }}
                        />
                        <input
                          type="number"
                          placeholder="+$"
                          value={option.precio}
                          onChange={(e) => updateDecisionOption(decisionIndex, optionIndex, "precio", e.target.value)}
                          className="min-w-0 rounded-xl px-2 py-2 text-xs text-white outline-none border"
                          style={{ background: "#0a0a0a", borderColor: "var(--line)" }}
                        />
                        <input
                          type="number"
                          placeholder="Final"
                          value={option.precioFinal}
                          onChange={(e) => updateDecisionOption(decisionIndex, optionIndex, "precioFinal", e.target.value)}
                          className="min-w-0 rounded-xl px-2 py-2 text-xs text-white outline-none border"
                          style={{ background: "#0a0a0a", borderColor: "var(--line)" }}
                        />
                        <button
                          onClick={() => removeDecisionOption(decisionIndex, optionIndex)}
                          className="w-8 h-8 rounded-full border text-xs"
                          style={{ borderColor: "#7f1d1d", color: "#f87171" }}
                        >
                          -
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => addDecisionOption(decisionIndex)}
                    className="w-full rounded-xl border py-2 text-xs mt-2"
                    style={{ borderColor: "var(--line)", color: "var(--muted)" }}
                  >
                    + Agregar opcion
                  </button>
                </div>
              ))}
            </div>
          )}
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
    <div className="min-h-screen max-w-md mx-auto px-5 py-6 app-surface">
      <div className="flex justify-between items-center mb-4">
        <span className="font-display font-black text-xl tracking-widest" style={{ color: "var(--gold)" }}>Productos</span>
        <div className="flex gap-2">
          <button onClick={abrirNuevo} className="text-xs border rounded-full px-3 py-1.5" style={{ borderColor: "var(--gold)", color: "var(--gold)" }}>+ Nuevo</button>
          <button onClick={handleLogout} className="text-xs border rounded-full px-3 py-1.5" style={{ borderColor: "var(--line)", color: "var(--muted)" }}>Salir</button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none border mb-4"
        style={{ background: "rgba(255,255,255,0.04)", borderColor: "var(--line)" }}
      />

      <div className="flex flex-col gap-3">
        {productos.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase())).map((p) => (
          <div key={p.id} className="glass-panel rounded-xl p-4">
            <div className="flex justify-between items-start gap-2 mb-1">
              <span className="text-sm font-medium text-white">{p.nombre}</span>
              <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={p.disponible ? { background: "rgba(157,182,127,0.14)", color: "var(--sage)", border: "1px solid rgba(157,182,127,0.28)" } : { background: "rgba(248,113,113,0.12)", color: "#f87171", border: "1px solid rgba(248,113,113,0.28)" }}>
                {p.disponible ? "Activo" : "Inactivo"}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mb-1">{p.categoria}</p>
            <p className="text-sm font-medium mb-3" style={{ color: "var(--gold)" }}>${Number(p.precio).toLocaleString("es-CL")}</p>
            {hasConfiguredDecisions(p) && (
              <p className="text-xs mb-3" style={{ color: "var(--gold)" }}>Con decisiones configuradas</p>
            )}
            <div className="flex gap-2">
              <button onClick={() => abrirEditar(p)} className="text-xs border rounded-full px-3 py-1.5 flex-1" style={{ borderColor: "var(--line)", color: "var(--muted)" }}>Editar</button>
              <button onClick={() => handleToggle(p.id, p.disponible)} className="text-xs border rounded-full px-3 py-1.5 flex-1" style={{ borderColor: "var(--line)", color: "var(--muted)" }}>{p.disponible ? "Desactivar" : "Activar"}</button>
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
