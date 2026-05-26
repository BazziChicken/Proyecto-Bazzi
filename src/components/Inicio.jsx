import { useState, useEffect, useRef } from "react"
import logo from "../assets/LOGGO_BAZZI_CHICKEN.png"
import foto1 from "../assets/foto_inicio2.jpeg"
import foto2 from "../assets/foto_inicio3.jpeg"
const slides = [
  {
    type: "video",
    src: "https://gnenxuwzljdguzftflov.supabase.co/storage/v1/object/public/productos/video_inicio.mp4",
    alt: "Video de Bazzi Chicken",
    duration: 10000
  },
  { type: "image", src: foto1, alt: "Foto de Bazzi Chicken", duration: 6000 },
  { type: "image", src: foto2, alt: "Foto de Bazzi Chicken", duration: 6000 }
]

export default function Inicio({ onVerMenu, onEspecial }) {
  const [fotoActual, setFotoActual] = useState(0)
  const touchStartX = useRef(null)

  useEffect(() => {
    const intervalo = setTimeout(() => {
      setFotoActual((prev) => (prev + 1) % slides.length)
    }, slides[fotoActual].duration)
    return () => clearTimeout(intervalo)
  }, [fotoActual])

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (diff > 50) setFotoActual((prev) => (prev + 1) % slides.length)
    if (diff < -50) setFotoActual((prev) => (prev - 1 + slides.length) % slides.length)
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
    <div className="min-h-screen flex flex-col app-surface safe-bottom">
      <section className="px-4 pt-8 pb-4">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <img src={logo} alt="Bazzi Chicken" className="w-24 h-24 object-contain drop-shadow-[0_12px_28px_rgba(255,106,26,0.24)]" />
          <div className="min-w-0">
            <p className="text-xs tracking-[0.22em] uppercase" style={{ color: "var(--muted)" }}>Maipú</p>
            <h1 className="font-black text-4xl tracking-[0.08em] leading-none mt-1" style={{ color: "var(--gold)" }}>
              BAZZI
            </h1>
            <p className="font-black text-xl tracking-[0.12em] leading-none text-white">CHICKEN</p>
          </div>
        </div>
      </section>

      <div
        className="relative mx-4 w-[calc(100%-2rem)] max-w-md sm:mx-auto sm:w-full rounded-[1.75rem] overflow-hidden border"
        style={{ height: "min(75vh, 700px)", minHeight: "500px", borderColor: "var(--line)", boxShadow: "0 26px 60px rgba(0,0,0,0.42)" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === fotoActual ? 1 : 0 }}
          >
            {slide.type === "video" ? (
              <video
                src={slide.src}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={slide.alt}
              />
            ) : (
              <img src={slide.src} alt={slide.alt} className="w-full h-full object-cover" />
            )}
          </div>
        ))}

        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.04) 24%, rgba(7,4,2,0.78) 100%)" }} />

        <div className="absolute left-5 right-5 bottom-5">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold mb-3" style={{ background: abierto ? "rgba(20, 83, 45, 0.82)" : "rgba(127, 29, 29, 0.82)", color: abierto ? "#bbf7d0" : "#fecaca" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: abierto ? "#4ade80" : "#f87171" }} />
            {abierto ? "Abierto ahora" : "Cerrado ahora"}
          </div>
          <p className="text-3xl font-black leading-tight text-white">Pollo asado, papas y sabor de barrio.</p>
        </div>

        <div className="absolute top-4 right-4 flex gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className="h-2 rounded-full transition-all"
              style={{ width: i === fotoActual ? "22px" : "8px", background: i === fotoActual ? "var(--gold)" : "rgba(255,255,255,0.45)" }}
            />
          ))}
        </div>
      </div>

      <div className="mx-4 max-w-md sm:mx-auto mt-4 glass-panel rounded-2xl p-4">
        <p className="text-sm text-center font-semibold text-white">Av. El Descanso 1400, Local 14, Maipú</p>
        <p className="text-xs text-center mt-1" style={{ color: "var(--muted)" }}>Martes a Domingo · 12:00 - 18:30 · Lunes cerrado</p>
      </div>

      {!abierto && (
        <div className="mx-4 max-w-md sm:mx-auto mt-3 border rounded-2xl p-4 text-center" style={{ background: "rgba(55, 10, 10, 0.76)", borderColor: "rgba(248, 113, 113, 0.26)" }}>
          <p className="text-sm font-semibold text-red-200">Estamos cerrados en este momento</p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>Volvemos de martes a domingo, 12:00 - 18:30</p>
        </div>
      )}

      <div className="px-4 max-w-md sm:mx-auto w-full mt-auto pb-4 pt-6 flex flex-col gap-3">
        <button
          onClick={onVerMenu}
          className="w-full rounded-2xl py-5 font-black text-lg tracking-widest transition-all hover:brightness-110 warm-button"
        >
          VER MENÚ
        </button>
        <button
          onClick={onEspecial}
          className="w-full rounded-2xl py-4 font-black text-sm tracking-widest transition-colors border"
          style={{ background: "rgba(255,255,255,0.04)", borderColor: "var(--line)", color: "var(--paper)" }}
        >
          SERVICIOS ESPECIALES
        </button>
      </div>
    </div>
  )
}
