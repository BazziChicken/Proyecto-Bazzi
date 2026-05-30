export default function Especial({ onBack }) {
  const servicios = [
  {
    titulo: "Pedidos para Eventos",
    desc: "¿Tienes una celebración, reunión de empresa o evento familiar? Preparamos pedidos grandes de pollos asados y acompañamientos para que no te preocupes de cocinar.",
    detalle: "Consultar disponibilidad y cantidad mínima."
  },
  {
    titulo: "Catering y Colaciones",
    desc: "Ofrecemos servicio de colaciones para empresas y grupos de trabajo. Menú variado con pollos, ensaladas, papas fritas y bebidas.",
    detalle: "Coordinar con anticipación."
  },
  {
    titulo: "Pedidos al por Mayor",
    desc: "Venta de pollos asados y acompañamientos en grandes cantidades para eventos, juntas de vecinos, celebraciones y más.",
    detalle: null
  }
]

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
        <span className="font-black text-xl tracking-widest" style={{ color: "var(--gold)" }}>Especial</span>
      </div>

      <div className="px-4 pt-5 flex flex-col gap-4">
        <div>
          <p className="text-xs tracking-[0.22em] uppercase" style={{ color: "var(--muted)" }}>Para grupos</p>
          <h1 className="text-3xl font-black leading-tight text-white">Bazzi para eventos y empresas</h1>
        </div>

        {servicios.map((s) => (
          <div key={s.titulo} className="glass-panel rounded-2xl p-5 flex flex-col gap-2">
            <span className="font-black text-lg tracking-wide" style={{ color: "var(--gold)" }}>{s.titulo}</span>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{s.desc}</p>
            {s.detalle && (
              <p className="text-xs font-bold mt-1" style={{ color: "#7d7065" }}>{s.detalle}</p>
            )}
          </div>
        ))}

        <a
          href="mailto:bazzichicken@gmail.com"
          className="w-full text-center rounded-2xl py-4 text-sm font-black tracking-widest uppercase mt-2 transition-all hover:brightness-110 warm-button"
        >
          Solicita tu cotización
        </a>

        <p className="text-center text-xs mt-0" style={{ color: "#a3a3a3" }}>bazzichicken@gmail.com</p>
      </div>
    </div>
  )
}
