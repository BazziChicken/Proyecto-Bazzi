import { useState } from "react"
import { WHATSAPP_NUMBER } from "../data/menu"
import { estaAbierto, proximaApertura, ahoraChile, minutosDeHora, APERTURA, CIERRE, HORA_APERTURA, HORA_CIERRE } from "../utils/horario"

export default function Checkout({ cart, onBack, onAdd, onRemove }) {
  const abierto = estaAbierto()
  const diaApertura = proximaApertura()
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [pago, setPago] = useState("")
  const [horario, setHorario] = useState(abierto ? "ahora" : "programado")
  const [hora, setHora] = useState("")

  const items = Object.values(cart)
  const total = items.reduce((sum, item) => sum + Number(item.precio || item.price) * item.qty, 0)
  const fmt = (n) => "$" + Number(n).toLocaleString("es-CL")

  const sendWhatsApp = () => {
    if (!nombre.trim()) { alert("Ingresa tu nombre para continuar."); return }
    if (!pago) { alert("Selecciona un método de pago."); return }
    if (horario === "programado" && !hora) { alert("Ingresa la hora para tu pedido."); return }
    const ahora = ahoraChile()
    if (horario === "programado") {
      const minutosPedido = minutosDeHora(hora)
      if (minutosPedido < APERTURA || minutosPedido > CIERRE) {
        alert(`Elige una hora entre ${HORA_APERTURA} y ${HORA_CIERRE}.`); return
      }
      if (abierto && minutosPedido < ahora.getHours() * 60 + ahora.getMinutes()) {
        alert("Esa hora ya pasó. Elige una hora más tarde o \"Lo antes posible\"."); return
      }
    }
    const horaActual = ahora.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit", hour12: false })

    const lines = items.map((i) => {
      const agregados = i.agregados && i.agregados.length > 0 ? ` (${i.agregados.join(", ")})` : ""
      return `• ${i.nombre || i.name}${agregados} x${i.qty} — ${fmt(Number(i.precio || i.price) * i.qty)}`
    }).join("\n")
    const horarioTexto = horario === "ahora"
      ? "Lo antes posible"
      : abierto ? `Para las ${hora}` : `Para ${diaApertura} a las ${hora}`

    const msg =
      `*Pedido BAZZI CHICKEN*\n\n` +
      `*Cliente:* ${nombre}\n` +
      (telefono.trim() ? `*Teléfono:* ${telefono.trim()}\n` : "") +
      `*Entrega:* Retiro en local\n` +
      `*Método de pago:* ${pago}\n` +
      `*Horario:* ${horarioTexto}\n\n` +
      `*Hora del pedido:* ${horaActual}\n\n` +
      `${lines}\n\n` +
      `*Total: ${fmt(total)}*`

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank")
  }

  return (
    <div className="min-h-screen max-w-md mx-auto pb-10 app-surface">
      <div className="px-5 pt-6 pb-4 flex items-center gap-4 border-b backdrop-blur-xl sticky top-0 z-20" style={{ borderColor: "var(--line)", background: "rgba(8, 5, 4, 0.88)" }}>
        <button
          onClick={onBack}
          className="text-sm border rounded-full px-4 py-2 transition-colors hover:bg-white/10"
          style={{ borderColor: "var(--line)", color: "var(--muted)" }}
        >
          Volver
        </button>
        <span className="font-display font-black text-xl tracking-widest" style={{ color: "var(--gold)" }}>Tu pedido</span>
      </div>

      <div className="px-4 pt-5 flex flex-col gap-5">
        <div className="glass-panel rounded-2xl p-4 flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.cartKey || item.id} className="flex justify-between items-center text-sm gap-2">
              <span className="flex-1 min-w-0" style={{ color: "var(--muted)" }}>
                <span className="block truncate text-white font-semibold">{item.nombre || item.name}</span>
                {item.agregados && item.agregados.length > 0 && (
                  <span className="block text-xs" style={{ color: "#7d7065" }}>{item.agregados.join(", ")}</span>
                )}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onRemove(item)}
                  className="w-9 h-9 rounded-full border flex items-center justify-center text-base hover:bg-white/10 transition-colors"
                  style={{ borderColor: "var(--line)", color: "var(--muted)" }}
                >
                  -
                </button>
                <span className="text-white font-black w-4 text-center">{item.qty}</span>
                <button
                  onClick={() => onAdd(item)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-base hover:brightness-110 transition-all warm-button"
                >
                  +
                </button>
              </div>
              <span className="text-white font-bold min-w-16 text-right">{fmt(Number(item.precio || item.price) * item.qty)}</span>
            </div>
          ))}
          <div className="border-t pt-3 mt-1 flex justify-between" style={{ borderColor: "var(--line)" }}>
            <span className="text-sm" style={{ color: "var(--muted)" }}>Total</span>
            <span className="font-black text-xl" style={{ color: "var(--gold)" }}>{fmt(total)}</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-4 flex gap-3 items-start">
          <svg className="flex-shrink-0 mt-0.5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: "var(--gold)" }}>
            <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
            <circle cx="12" cy="9.5" r="2.5" />
          </svg>
          <div>
            <p className="text-sm font-black text-white">Retiro en local</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>Av. El Descanso 1400, Local 14, Maipú. Si prefieres delivery, encuéntranos en Uber Eats.</p>
          </div>
        </div>

        {!abierto && (
          <div className="border rounded-2xl p-4" style={{ background: "rgba(55, 10, 10, 0.76)", borderColor: "rgba(248, 113, 113, 0.26)" }}>
            <p className="text-sm font-semibold text-red-200">Estamos cerrados en este momento</p>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              Puedes dejar tu pedido programado para {diaApertura}, entre {HORA_APERTURA} y {HORA_CIERRE}.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-xs tracking-widest uppercase" style={{ color: "var(--muted)" }}>Nombre de quien retira</label>
          <input
            type="text"
            placeholder="Tu nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="rounded-2xl px-4 py-4 text-sm text-white outline-none border transition-colors"
            style={{ background: "rgba(255,255,255,0.04)", borderColor: "var(--line)" }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="telefono" className="text-xs tracking-widest uppercase" style={{ color: "var(--muted)" }}>
            Teléfono <span className="normal-case tracking-normal">(opcional)</span>
          </label>
          <input
            id="telefono"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+56 9 1234 5678"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="rounded-2xl px-4 py-4 text-sm text-white outline-none border transition-colors"
            style={{ background: "rgba(255,255,255,0.04)", borderColor: "var(--line)" }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs tracking-widest uppercase" style={{ color: "var(--muted)" }}>Método de pago</label>
          <div className="grid grid-cols-3 gap-2">
            {["Efectivo", "Débito", "Transferencia"].map((m) => (
              <button
                key={m}
                onClick={() => setPago(m)}
                className="rounded-2xl min-h-12 px-2 text-xs sm:text-sm border transition-all"
                style={
                  pago === m
                    ? { background: "var(--gold)", color: "#140803", borderColor: "var(--gold)", fontWeight: 800 }
                    : { background: "rgba(255,255,255,0.04)", borderColor: "var(--line)", color: "var(--muted)" }
                }
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs tracking-widest uppercase" style={{ color: "var(--muted)" }}>Horario</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "ahora", label: "Lo antes posible" },
              { value: "programado", label: "Hora específica" }
            ].map((op) => (
              <button
                key={op.value}
                onClick={() => setHorario(op.value)}
                disabled={op.value === "ahora" && !abierto}
                className="rounded-2xl min-h-12 px-3 text-sm border transition-all disabled:opacity-35 disabled:cursor-not-allowed"
                style={
                  horario === op.value
                    ? { background: "var(--gold)", color: "#140803", borderColor: "var(--gold)", fontWeight: 800 }
                    : { background: "rgba(255,255,255,0.04)", borderColor: "var(--line)", color: "var(--muted)" }
                }
              >
                {op.label}
              </button>
            ))}
          </div>

          {horario === "programado" && (
            <input
              type="time"
              min={HORA_APERTURA}
              max={HORA_CIERRE}
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="rounded-2xl px-4 py-4 text-sm text-white outline-none border transition-colors mt-1"
              style={{ background: "rgba(255,255,255,0.04)", borderColor: "var(--line)" }}
            />
          )}
        </div>

        <button
          onClick={sendWhatsApp}
          className="w-full rounded-2xl py-4 text-sm font-black tracking-wide transition-all hover:brightness-110 mt-2 warm-button"
        >
          Confirmar y enviar por WhatsApp
        </button>
      </div>
    </div>
  )
}
