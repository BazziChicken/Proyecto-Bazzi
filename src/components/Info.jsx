export default function Info({ onBack }) {
  const horarios = [
    { dia: "Lunes", hora: "12:30 — 21:30" },
    { dia: "Martes", hora: "12:30 — 21:30" },
    { dia: "Miércoles", hora: "12:30 — 21:30" },
    { dia: "Jueves", hora: "12:30 — 21:30" },
    { dia: "Viernes", hora: "12:30  — 22:30" },
    { dia: "Sábado", hora: "12:30  — 22:30" },
    { dia: "Domingo", hora: "12:30  — 20:30" },
  ]

  const ahora = new Date()
  const dia = ahora.getDay()
  const minutos = ahora.getHours() * 60 + ahora.getMinutes()

  const abierto = (() => {
    if (dia === 0) return minutos >= 780 && minutos < 1260
    if (dia === 5 || dia === 6) return minutos >= 780 && minutos < 1380
    return minutos >= 780 && minutos < 1320
  })()

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
        <span className="font-black text-xl tracking-widest" style={{ color: "var(--gold)" }}>Información</span>
      </div>

      <div className="px-5 pt-6 flex flex-col gap-6">

        <div className="border rounded-xl p-5 flex flex-col gap-1" style={{ background: "#111111", borderColor: "#2a2a2a" }}>
          <span className="text-xs tracking-widest text-neutral-400 uppercase mb-2">Dirección</span>
          <span className="text-white text-sm font-medium">El Descanso 1400, Local 17</span>
          <span className="text-neutral-400 text-sm">Maipú, Región Metropolitana</span>
        </div>

        <div className="border rounded-xl p-5" style={{ background: "#111111", borderColor: "#2a2a2a" }}>
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs tracking-widest text-neutral-400 uppercase">Horario</span>
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={
                abierto
                  ? { background: "#0f2a0f", color: "#4ade80", border: "1px solid #14532d" }
                  : { background: "#2a0f0f", color: "#f87171", border: "1px solid #7f1d1d" }
              }
            >
              {abierto ? "Abierto ahora" : "Cerrado"}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {horarios.map((h) => {
              const index = horarios.indexOf(h)
              const diaActual = dia === 0 ? 6 : dia - 1
              const esHoy = index === diaActual

              return (
                <div
                  key={h.dia}
                  className="flex justify-between text-sm py-2 border-b"
                  style={{ borderColor: "#1a1a1a" }}
                >
                  <span style={esHoy ? { color: "var(--gold)", fontWeight: 600 } : { color: "#a3a3a3" }}>
                    {h.dia}
                  </span>
                  <span style={esHoy ? { color: "var(--gold)", fontWeight: 600 } : { color: "#606060" }}>
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