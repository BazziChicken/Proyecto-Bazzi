import { useState, useEffect, useRef } from "react"
import { estaAbierto, proximaApertura } from "../utils/horario"
import { WHATSAPP_NUMBER } from "../data/menu"
import logo from "../assets/LOGGO_BAZZI_CHICKEN.png"
import foto2 from "../assets/foto_inicio2.jpeg"
import foto3 from "../assets/foto_inicio3.jpeg"
import foto4 from "../assets/foto_inicio4.jpeg"
import foto5 from "../assets/bazzifotouber.jpeg"

const slides = [
  {
    type: "video",
    src: "https://gnenxuwzljdguzftflov.supabase.co/storage/v1/object/public/productos/video_inicio.mp4",
    alt: "Video de Bazzi Chicken",
    duration: 10000
  },
  { type: "image", src: foto2, alt: "Foto de Bazzi Chicken", duration: 6000 },
  { type: "image", src: foto5, alt: "Foto de Bazzi Chicken", duration: 6000 },
  { type: "image", src: foto4, alt: "Foto de Bazzi Chicken", duration: 6000 },
  { type: "image", src: foto3, alt: "Foto de Bazzi Chicken", duration: 6000 }
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

  const abierto = estaAbierto()

  return (
    <div className="min-h-screen flex flex-col app-surface safe-bottom">
      <section className="px-4 pt-5 pb-3">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <img src={logo} alt="Bazzi Chicken" className="w-20 h-20 object-contain drop-shadow-[0_12px_28px_rgba(255,106,26,0.24)]" />
          <div className="min-w-0">
            <p className="text-xs tracking-[0.22em] uppercase" style={{ color: "var(--muted)" }}>Maipú</p>
            <h1 className="font-display font-black text-4xl tracking-[0.02em] leading-none mt-1" style={{ color: "var(--gold)" }}>
              BAZZI
            </h1>
            <p className="font-display font-black text-xl tracking-[0.06em] leading-none text-white mt-0.5">CHICKEN</p>
          </div>
        </div>
      </section>

      <div
        className="relative mx-4 w-[calc(100%-2rem)] max-w-md sm:mx-auto sm:w-full rounded-[1.75rem] overflow-hidden border"
        style={{ aspectRatio: "480 / 848", maxHeight: "700px", borderColor: "var(--line)", boxShadow: "0 26px 60px rgba(0,0,0,0.42)" }}
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
                preload="auto"
                aria-label={slide.alt}
                onClick={(e) => e.target.play()}
              />
            ) : (
              <img src={slide.src} alt={slide.alt} className="w-full h-full object-cover" />
            )}
          </div>
        ))}

        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.04) 24%, rgba(7,4,2,0.78) 100%)" }} />

        <button
          onClick={() => setFotoActual((prev) => (prev - 1 + slides.length) % slides.length)}
          aria-label="Foto anterior"
          className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full items-center justify-center text-white text-lg transition-colors hover:bg-black/50"
          style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.18)" }}
        >
          ‹
        </button>
        <button
          onClick={() => setFotoActual((prev) => (prev + 1) % slides.length)}
          aria-label="Foto siguiente"
          className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full items-center justify-center text-white text-lg transition-colors hover:bg-black/50"
          style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.18)" }}
        >
          ›
        </button>

        <div className="absolute left-5 right-5 bottom-5">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold mb-3" style={{ background: abierto ? "rgba(20, 83, 45, 0.82)" : "rgba(127, 29, 29, 0.82)", color: abierto ? "#bbf7d0" : "#fecaca" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: abierto ? "#4ade80" : "#f87171" }} />
            {abierto ? "Abierto ahora" : "Cerrado ahora"}
          </div>
          <p className="text-3xl font-black leading-tight text-white">Pollo asado, papas y sabor de barrio.</p>
        </div>

        <div className="absolute top-4 right-4 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setFotoActual(i)}
              aria-label={`Ir a la foto ${i + 1}`}
              className="h-2 rounded-full transition-all cursor-pointer"
              style={{ width: i === fotoActual ? "22px" : "8px", background: i === fotoActual ? "var(--gold)" : "rgba(255,255,255,0.45)" }}
            />
          ))}
        </div>
      </div>

      {/* Se queda pegado abajo mientras el video ocupa la pantalla, así el botón principal siempre está a la vista */}
      <div
        className="sticky bottom-0 z-30 px-4 max-w-md sm:mx-auto w-full mt-2 pt-3"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))", background: "linear-gradient(180deg, rgba(8,5,4,0) 0%, rgba(8,5,4,0.92) 38%)" }}
      >
        <button
          onClick={onVerMenu}
          className="w-full rounded-2xl py-5 font-black text-lg tracking-widest transition-all hover:brightness-110 warm-button"
        >
          {abierto ? "VER MENÚ Y PEDIR" : "VER MENÚ"}
        </button>
      </div>

      <div className="mx-4 max-w-md sm:mx-auto mt-4 glass-panel rounded-2xl p-4">
        <p className="text-sm text-center font-semibold text-white">Av. El Descanso 1400, Local 14, Maipú</p>
        <p className="text-xs text-center mt-1" style={{ color: "var(--muted)" }}>Martes a Domingo · 12:00 - 18:30 · Lunes cerrado</p>
      </div>

      {!abierto && (
        <div className="mx-4 max-w-md sm:mx-auto mt-3 border rounded-2xl p-4 text-center" style={{ background: "rgba(55, 10, 10, 0.76)", borderColor: "rgba(248, 113, 113, 0.26)" }}>
          <p className="text-sm font-semibold text-red-200">Estamos cerrados en este momento</p>
          <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>Abrimos {proximaApertura()} a las 12:00. Puedes dejar tu pedido programado desde el menú.</p>
        </div>
      )}

      <div className="px-4 max-w-md sm:mx-auto w-full mt-auto pb-6 pt-4 flex flex-col gap-3">
        <button
          onClick={onEspecial}
          className="w-full rounded-2xl py-4 font-black text-sm tracking-widest transition-colors border"
          style={{ background: "rgba(255,255,255,0.04)", borderColor: "var(--line)", color: "var(--paper)" }}
        >
          SERVICIOS ESPECIALES
        </button>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola Bazzi Chicken, tengo una consulta")}`}
          target="_blank"
          rel="noreferrer"
          className="w-full rounded-2xl py-4 font-black text-sm tracking-widest transition-colors border flex items-center justify-center gap-2"
          style={{ background: "rgba(37, 211, 102, 0.1)", borderColor: "rgba(37, 211, 102, 0.35)", color: "#86efac" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
          </svg>
          ESCRÍBENOS POR WHATSAPP
        </a>
        <a
          href="https://www.instagram.com/bazzichicken/"
          target="_blank"
          rel="noreferrer"
          className="w-full rounded-2xl py-4 font-black text-sm tracking-widest transition-colors border flex items-center justify-center gap-2"
          style={{ background: "rgba(255,255,255,0.04)", borderColor: "var(--line)", color: "var(--paper)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          SÍGUENOS EN INSTAGRAM
        </a>
      </div>
    </div>
  )
}