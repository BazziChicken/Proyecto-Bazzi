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
    <div className="min-h-screen max-w-md mx-auto pb-10" style={{ background: "#0a0a0a" }}>

      <div className="px-5 pt-6 pb-4 flex items-center gap-4 border-b" style={{ borderColor: "#2a2a2a" }}>
        <button
          onClick={onBack}
          className="text-sm border rounded-full px-4 py-1.5 transition-colors hover:bg-neutral-800"
          style={{ borderColor: "#404040", color: "#a3a3a3" }}
        >
          Volver
        </button>
        <span className="font-black text-xl tracking-widest" style={{ color: "var(--gold)" }}>Especial</span>
      </div>

      <div className="px-5 pt-6 flex flex-col gap-4">

        {servicios.map((s) => (
          <div key={s.titulo} className="border rounded-xl p-5 flex flex-col gap-2" style={{ background: "#111111", borderColor: "#2a2a2a" }}>
            <span className="font-black text-base tracking-wide" style={{ color: "var(--gold)" }}>{s.titulo}</span>
            <p className="text-sm text-neutral-400 leading-relaxed">{s.desc}</p>
            {s.detalle && (
              <p className="text-xs font-medium text-neutral-500 mt-1">{s.detalle}</p>
            )}
          </div>
        ))}

        <a
          href="mailto:contactobazzichicken@gmail.com"
          className="w-full text-center rounded-xl py-4 text-sm font-semibold tracking-widest uppercase mt-2 transition-opacity hover:opacity-85"
          style={{ background: "var(--gold)", color: "#0a0a0a" }}
        >
          Solicita tu cotización
        </a>

        <p className="text-center text-xs mt-0" style={{ color: "#a3a3a3" }}>contactobazzichicken@gmail.com</p>

      </div>
    </div>
  )
}