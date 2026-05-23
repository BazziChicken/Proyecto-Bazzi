export default function Info({ onBack }) {
  const horarios = [
  { dia: "Lunes", hora: "Cerrado" },
  { dia: "Martes", hora: "12:00 — 18:30" },
  { dia: "Miércoles", hora: "12:00 — 18:30" },
  { dia: "Jueves", hora: "12:00 — 18:30" },
  { dia: "Viernes", hora: "12:00 — 18:30" },
  { dia: "Sábado", hora: "12:00 — 18:30" },
  { dia: "Domingo", hora: "12:00 — 18:30" },
]

  const ahora = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Santiago" }))
const dia = ahora.getDay()
const minutos = ahora.getHours() * 60 + ahora.getMinutes()

  const abierto = (() => {
  if (dia === 1) return false
  return minutos >= 720 && minutos < 1110
})()

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
        <span className="font-black text-xl tracking-widest" style={{ color: "var(--gold)" }}>Información</span>
      </div>

      <div className="px-4 pt-5 flex flex-col gap-5">
        <div className="glass-panel rounded-2xl p-5 flex flex-col gap-1">
          <span className="text-xs tracking-widest uppercase mb-2" style={{ color: "var(--muted)" }}>Dirección</span>
          <span className="text-base font-black text-white">Av. El Descanso 1400, Local 14</span>
          <span className="text-sm" style={{ color: "var(--muted)" }}>Maipú, Región Metropolitana</span>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Av+El+Descanso+1400+Local+14+Maipu"
            target="_blank"
            rel="noreferrer"
            className="mt-4 w-full text-center rounded-2xl py-4 text-sm font-black tracking-wide transition-all hover:brightness-110 warm-button"
        >
            Ver en Google Maps
        </a>
        </div>

        <div className="glass-panel rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs tracking-widest uppercase" style={{ color: "var(--muted)" }}>Horario</span>
            <span
              className="text-xs font-bold px-3 py-1.5 rounded-full"
              style={
                abierto
                  ? { background: "rgba(20, 83, 45, 0.72)", color: "#bbf7d0", border: "1px solid rgba(74, 222, 128, 0.25)" }
                  : { background: "rgba(127, 29, 29, 0.72)", color: "#fecaca", border: "1px solid rgba(248, 113, 113, 0.28)" }
              }
            >
              {abierto ? "Abierto ahora" : "Cerrado"}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            {horarios.map((h) => {
              const index = horarios.indexOf(h)
              const diaActual = dia === 0 ? 6 : dia - 1
              const esHoy = index === diaActual

              return (
                <div
                  key={h.dia}
                  className="flex justify-between text-sm py-2.5 border-b last:border-b-0"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}
                >
                  <span style={esHoy ? { color: "var(--gold)", fontWeight: 800 } : { color: "var(--muted)" }}>
                    {h.dia}
                  </span>
                  <span style={esHoy ? { color: "var(--gold)", fontWeight: 800 } : { color: "#7d7065" }}>
                    {h.hora}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
