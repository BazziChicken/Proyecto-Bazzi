// Horario del local: martes a domingo, 12:00 a 18:30 (hora de Chile). Lunes cerrado.
export const APERTURA = 12 * 60
export const CIERRE = 18 * 60 + 30
export const HORA_APERTURA = "12:00"
export const HORA_CIERRE = "18:30"

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"]

export const ahoraChile = () => new Date(new Date().toLocaleString("en-US", { timeZone: "America/Santiago" }))

const abreEseDia = (dia) => dia !== 1

export const estaAbierto = (fecha = ahoraChile()) => {
  const minutos = fecha.getHours() * 60 + fecha.getMinutes()
  return abreEseDia(fecha.getDay()) && minutos >= APERTURA && minutos < CIERRE
}

// Texto del próximo día de apertura: "hoy", "mañana" o el nombre del día
export const proximaApertura = (fecha = ahoraChile()) => {
  const minutos = fecha.getHours() * 60 + fecha.getMinutes()
  if (abreEseDia(fecha.getDay()) && minutos < APERTURA) return "hoy"
  for (let i = 1; i <= 7; i++) {
    const dia = (fecha.getDay() + i) % 7
    if (abreEseDia(dia)) return i === 1 ? "mañana" : `el ${DIAS[dia]}`
  }
  return "pronto"
}

export const minutosDeHora = (hora) => {
  const [h, m] = hora.split(":").map(Number)
  return h * 60 + m
}
