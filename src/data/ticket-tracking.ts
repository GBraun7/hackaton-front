import type { Ticket } from '@/data/tickets'

export interface GeoPoint { lat: number; lng: number }
export interface RecordedPosition extends GeoPoint { recordedAt: string }
export interface TrackingSnapshot {
  destination: GeoPoint
  points: RecordedPosition[]
  mode: 'live' | 'history' | 'none'
  finishedAt: string | null
  arrived: boolean
}
const liveSessions = new Map<number, number>()
// Coordenadas fictícias na região de São José dos Pinhais, não endereços das unidades.
const destinations: GeoPoint[] = [
  { lat: -25.5346, lng: -49.2038 },
  { lat: -25.5297, lng: -49.1974 },
  { lat: -25.5381, lng: -49.2012 },
  { lat: -25.5335, lng: -49.1928 },
]
function routeFor(ticket: Ticket): GeoPoint[] {
  const target = destinations[(ticket.id - 14142) % destinations.length]
  return Array.from({ length: 16 }, (_, index) => {
    const progress = index / 15
    return { lat: target.lat + 0.008 * (1 - progress), lng: target.lng - 0.009 * (1 - progress) + Math.sin(progress * Math.PI) * 0.001 }
  })
}
export function getTrackingSnapshot(ticket: Ticket, now = Date.now()): TrackingSnapshot {
  const route = routeFor(ticket)
  const destination = route[route.length - 1]
  if (ticket.executionState === 'Aberto') return { destination, points: [], mode: 'none', finishedAt: null, arrived: false }
  if (ticket.executionState === 'Em andamento') {
    if (!liveSessions.has(ticket.id)) liveSessions.set(ticket.id, now - 15_000)
    const start = liveSessions.get(ticket.id)!
    const count = Math.min(route.length, Math.max(1, Math.floor((now - start) / 5000) + 1))
    return { destination, points: route.slice(0, count).map((point, index) => ({ ...point, recordedAt: new Date(start + index * 5000).toISOString() })), mode: 'live', finishedAt: null, arrived: count === route.length }
  }
  const startedAt = new Date(ticket.createdAt.replace('09:30', '10:15')).getTime()
  const complete = ticket.executionState === 'Resolvido' || ticket.executionState === 'Aguardando validação'
  const points = route.slice(0, complete ? route.length : 7).map((point, index) => ({ ...point, recordedAt: new Date(startedAt + index * 5 * 60_000).toISOString() }))
  return { destination, points, mode: 'history', finishedAt: complete ? points[points.length - 1].recordedAt : null, arrived: complete }
}
export function routeDistanceKm(points: GeoPoint[]) {
  const radians = (value: number) => value * Math.PI / 180
  return points.slice(1).reduce((sum, point, index) => {
    const previous = points[index]
    const deltaLat = radians(point.lat - previous.lat)
    const deltaLng = radians(point.lng - previous.lng)
    const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(radians(previous.lat)) * Math.cos(radians(point.lat)) * Math.sin(deltaLng / 2) ** 2
    return sum + 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)))
  }, 0)
}
