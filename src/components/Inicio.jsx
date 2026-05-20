import { useState, useEffect, useRef } from "react"
import logo from "../assets/LOGGO_BAZZI_CHICKEN.png"
import foto1 from "../assets/foto_inicio1.jpg"
import foto2 from "../assets/foto_inicio2.jpg"
import foto3 from "../assets/foto_inicio3.jpg"

const fotos = [foto1, foto2, foto3]

export default function Inicio({ onVerMenu,onEspecial }) {
  const [fotoActual, setFotoActual] = useState(0)
  const touchStartX = useRef(null)

  useEffect(() => {
    const intervalo = setInterval(() => {
      setFotoActual((prev) => (prev + 1) % fotos.length)
    }, 3000)
    return () => clearInterval(intervalo)
  }, [])

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (diff > 50) setFotoActual((prev) => (prev + 1) % fotos.length)
    if (diff < -50) setFotoActual((prev) => (prev - 1 + fotos.length) % fotos.length)
    touchStartX.current = null
  }
  const ahora = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Santiago" }))
  const dia = ahora.getDay()
  const minutos = ahora.getHours() * 60 + ahora.getMinutes()

  const abierto = (() => {
    if (dia === 1) return false
    return minutos >= 780 && minutos < 1320
  })()

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0a0a0a" }}>

      <div className="flex flex-col items-center justify-center pt-16 pb-8 px-6">
        <img src={logo} alt="Bazzi Chicken" className="w-52 h-52 object-contain mb-6" />
        <h1 className="font-black text-4xl tracking-widest text-center mb-2" style={{ color: "var(--gold)" }}>
          BAZZI CHICKEN
        </h1>
        <p className="text-sm tracking-widest text-center" style={{ color: "#8B6020" }}>
          MÁS QUE POLLOS
        </p>
      </div>

      <div
        className="relative mx-4 rounded-2xl overflow-hidden"
        style={{ height: "500px" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
    >       
        {fotos.map((foto, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === fotoActual ? 1 : 0 }}
          >
            <img src={foto} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}

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

      <div className="mx-4 mt-4 border rounded-xl p-4" style={{ background: "#111111", borderColor: "#2a2a2a" }}>
        <p className="text-xs text-center" style={{ color: "#606060" }}>
          Av. El Descanso 1400, Local 14 — Maipú
        </p>
        <p className="text-xs text-center mt-1" style={{ color: "#606060" }}>
            Martes a Domingo · 13:00 - 22:00
        </p>
        <p className="text-xs text-center mt-1" style={{ color: "#606060" }}>
        Lunes cerrado
        </p>
      </div>
          {!abierto && (
            <div className="mx-4 mt-3 border rounded-xl p-4 text-center" style={{ background: "#1a0000", borderColor: "#4a0000" }}>
              <p className="text-sm font-semibold" style={{ color: "#ff4444" }}>Estamos cerrados en este momento</p>
              <p className="text-xs mt-1" style={{ color: "#606060" }}>Martes a Domingo · 13:00 - 22:00</p>
            </div>
          )}
      <div className="px-4 mt-auto pb-10 pt-8 flex flex-col gap-5">
        <button
          onClick={onVerMenu}
          className="w-full rounded-2xl py-5 font-black text-lg tracking-widest transition-opacity hover:opacity-85"
          style={{ background: "var(--gold)", color: "#0a0a0a" }}
        >
          VER MENÚ
        </button>
        <button
          onClick={onEspecial}
          className="w-full rounded-2xl py-4 font-black text-sm tracking-widest transition-opacity hover:opacity-85"
          style={{ background: "var(--gold)", color: "#0a0a0a" }}
        >
          SERVICIOS ESPECIALES
        </button>
      </div>

    </div>
  )
}