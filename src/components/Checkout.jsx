import { useState } from "react"
import { WHATSAPP_NUMBER } from "../data/menu"

export default function Checkout({ cart, onBack, onAdd, onRemove }) {
  const [nombre, setNombre] = useState("")
  const [pago, setPago] = useState("")
  const [horario, setHorario] = useState("ahora")
  const [hora, setHora] = useState("")

  const items = Object.values(cart)
  const total = items.reduce((sum, item) => sum + Number(item.precio || item.price) * item.qty, 0)
  const fmt = (n) => "$" + Number(n).toLocaleString("es-CL")

  const sendWhatsApp = () => {
    if (!nombre.trim()) { alert("Ingresa tu nombre para continuar."); return }
    if (!pago) { alert("Selecciona un método de pago."); return }
    if (horario === "programado" && !hora) { alert("Ingresa la hora para tu pedido."); return }
    const ahora = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Santiago" }))
    const horaActual = ahora.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", hour12: false })

    const lines = items.map((i) => {
      const agregados = i.agregados && i.agregados.length > 0 ? ` (${i.agregados.join(", ")})` : ""
      return `• ${i.nombre || i.name}${agregados} x${i.qty} — ${fmt(Number(i.precio || i.price) * i.qty)}`
    }).join("\n")
    const horarioTexto = horario === "ahora" ? "Lo antes posible" : `Para las ${hora}`

    const msg =
      `*Pedido BAZZI CHICKEN*\n\n` +
      `*Cliente:* ${nombre}\n` +
      `*Método de pago:* ${pago}\n` +
      `*Horario:* ${horarioTexto}\n\n` +
      `*Hora del pedido:* ${horaActual}\n\n` +
      `${lines}\n\n` +
      `*Total: ${fmt(total)}*`

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank")
  }

  return (
    <div className="min-h-screen max-w-md mx-auto pb-10" style={{ background: "#0a0a0a" }}>

      <div className="px-5 pt-6 pb-4 flex items-center gap-4 border-b" style={{ borderColor: "#2a2a2a" }}>
        <button
          onClick={onBack}
          className="text-sm border rounded-full px-4 py-1.5 transition-colors hover:bg-neutral-800"
          style={{ borderColor: "#404040", color: "#a3a3a3" }}
        >
          Volver
        </button>
        <span className="font-black text-xl tracking-widest" style={{ color: "var(--gold)" }}>Tu pedido</span>
      </div>

      <div className="px-5 pt-6 flex flex-col gap-6">

        <div className="border rounded-xl p-4 flex flex-col gap-2" style={{ background: "#111111", borderColor: "#2a2a2a" }}>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-sm gap-2">
              <span className="flex-1" style={{ color: "#a3a3a3" }}>
                {item.nombre || item.name}
                {item.agregados && item.agregados.length > 0 && (
                  <span className="block text-xs" style={{ color: "#606060" }}>{item.agregados.join(", ")}</span>
                )}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onRemove(item)}
                  className="w-7 h-7 rounded-full border flex items-center justify-center text-base hover:bg-neutral-800 transition-colors"
                  style={{ borderColor: "#404040", color: "#a3a3a3" }}
                >
                  -
                </button>
                <span className="text-white font-medium w-4 text-center">{item.qty}</span>
                <button
                  onClick={() => onAdd(item)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-base hover:opacity-80 transition-opacity"
                  style={{ background: "var(--gold)", color: "#0a0a0a" }}
                >
                  +
                </button>
              </div>
              <span className="text-white font-medium min-w-16 text-right">{fmt(Number(item.precio || item.price) * item.qty)}</span>
            </div>
          ))}
          <div className="border-t pt-3 mt-1 flex justify-between" style={{ borderColor: "#2a2a2a" }}>
            <span className="text-sm text-neutral-400">Total</span>
            <span className="font-black text-base" style={{ color: "var(--gold)" }}>{fmt(total)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs tracking-widest text-neutral-400 uppercase">Nombre de quien retira</label>
          <input
            type="text"
            placeholder="Tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="rounded-xl px-4 py-3 text-sm text-white outline-none border transition-colors focus:border-yellow-600"
            style={{ background: "#111111", borderColor: "#2a2a2a" }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs tracking-widest text-neutral-400 uppercase">Método de pago</label>
          <div className="grid grid-cols-3 gap-2">
            {["Efectivo", "Débito", "Transferencia"].map((m) => (
              <button
                key={m}
                onClick={() => setPago(m)}
                className="rounded-xl py-3 text-sm border transition-all"
                style={
                  pago === m
                    ? { background: "var(--gold)", color: "#0a0a0a", borderColor: "var(--gold)", fontWeight: 600 }
                    : { background: "#111111", borderColor: "#2a2a2a", color: "#a3a3a3" }
                }
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs tracking-widest text-neutral-400 uppercase">Horario</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "ahora", label: "Lo antes posible" },
              { value: "programado", label: "Hora específica" }
            ].map((op) => (
              <button
                key={op.value}
                onClick={() => setHorario(op.value)}
                className="rounded-xl py-3 text-sm border transition-all"
                style={
                  horario === op.value
                    ? { background: "var(--gold)", color: "#0a0a0a", borderColor: "var(--gold)", fontWeight: 600 }
                    : { background: "#111111", borderColor: "#2a2a2a", color: "#a3a3a3" }
                }
              >
                {op.label}
              </button>
            ))}
          </div>

          {horario === "programado" && (
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="rounded-xl px-4 py-3 text-sm text-white outline-none border transition-colors focus:border-yellow-600 mt-1"
              style={{ background: "#111111", borderColor: "#2a2a2a" }}
            />
          )}
        </div>

        <button
          onClick={sendWhatsApp}
          className="w-full rounded-xl py-4 text-sm font-semibold tracking-wide transition-opacity hover:opacity-85 mt-2"
          style={{ background: "var(--gold)", color: "#0a0a0a" }}
        >
          Confirmar y enviar por WhatsApp
        </button>

      </div>
    </div>
  )
}