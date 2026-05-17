import { useState, useEffect } from "react"
import logo from "../assets/LOGO_BAZZI_CHICKEN.jpg"

const fotos = [
  "/placeholder1.jpg",
  "/placeholder2.jpg",
  "/placeholder3.jpg",
]

export default function Inicio({ onVerMenu }) {
  const [fotoActual, setFotoActual] = useState(0)

  useEffect(() => {
    const intervalo = setInterval(() => {
      setFotoActual((prev) => (prev + 1) % fotos.length)
    }, 3000)
    return () => clearInterval(intervalo)
  }, [])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0a0a0a" }}>

      {/* Hero con logo */}
      <div className="flex flex-col items-center justify-center pt-16 pb-8 px-6">
        <img src={logo} alt="Bazzi Chicken" className="w-36 h-36 object-contain mb-6" />
        <h1 className="font-black text-4xl tracking-widest text-center mb-2" style={{ color: "var(--gold)" }}>
          BAZZI CHICKEN
        </h1>
        <p className="text-sm tracking-widest text-center" style={{ color: "#8B6020" }}>
          MÁS QUE POLLOS
        </p>
      </div>

      {/* Carrusel de fotos */}
      <div className="relative mx-4 rounded-2xl overflow-hidden" style={{ height: "220px" }}>
        {fotos.map((foto, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === fotoActual ? 1 : 0 }}
          >
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: "#1a1a1a" }}
            >
              <span className="text-xs" style={{ color: "#404040" }}>Foto {i + 1}</span>
            </div>
          </div>
        ))}

        {/* Indicadores */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {fotos.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all"
              style={{ background: i === fotoActual ? "var(--gold)" : "#404040" }}
            />
          ))}
        </div>
      </div>

      {/* Info del local */}
      <div className="mx-4 mt-4 border rounded-xl p-4" style={{ background: "#111111", borderColor: "#2a2a2a" }}>
        <p className="text-xs text-center" style={{ color: "#606060" }}>
          Av. El Descanso 1400, Local 14 — Maipú
        </p>
        <p className="text-xs text-center mt-1" style={{ color: "#606060" }}>
          Lunes a Domingo · 13:00 - 22:00
        </p>
      </div>

      {/* Botón ver menú */}
      <div className="px-4 mt-auto pb-10 pt-8">
        <button
          onClick={onVerMenu}
          className="w-full rounded-2xl py-5 font-black text-lg tracking-widest transition-opacity hover:opacity-85"
          style={{ background: "var(--gold)", color: "#0a0a0a" }}
        >
          VER MENÚ
        </button>
      </div>

    </div>
  )
}