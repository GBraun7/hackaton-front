import type { Ticket } from '@/data/tickets'
import type { GeoPoint } from '@/data/ticket-tracking'
import { executionIntervals } from '@/lib/ticket-execution'

// Parâmetros exclusivos da demonstração; não são políticas municipais.
export const proximityDemo = { radiusKm: 2, maxAgeMs: 15 * 60_000, maxAccuracy: 100 }
export interface MockPosition extends GeoPoint { recordedAt: string; accuracy: number; technicianId?: string }
export const unitPositions: Record<string, GeoPoint> = {
  'Unidade de Saúde Borda do Campo': { lat: -25.5346, lng: -49.2038 },
  'Hospital Municipal (demonstração)': { lat: -25.533, lng: -49.202 },
  'Escola Municipal Araucária': { lat: -25.5297, lng: -49.1974 },
  'Prefeitura · Recepção': { lat: -25.5381, lng: -49.2012 },
  'Biblioteca Municipal': { lat: -25.5335, lng: -49.1928 },
}
export function validPosition(position: unknown): position is MockPosition {
  if (!position || typeof position !== 'object') return false
  const p = position as MockPosition
  return Number.isFinite(p.lat) && Math.abs(p.lat) <= 90 && Number.isFinite(p.lng) && Math.abs(p.lng) <= 180 && Number.isFinite(p.accuracy) && p.accuracy >= 0 && Number.isFinite(Date.parse(p.recordedAt)) && (p.technicianId === undefined || typeof p.technicianId === 'string')
}
export function freshPosition(position: MockPosition | undefined, now = Date.now()) {
  return Boolean(position && validPosition(position) && now >= Date.parse(position.recordedAt) && now - Date.parse(position.recordedAt) <= proximityDemo.maxAgeMs && position.accuracy <= proximityDemo.maxAccuracy)
}
export function distanceKm(a: GeoPoint, b: GeoPoint) {
  const rad = (n: number) => n * Math.PI / 180
  const h = Math.sin(rad(b.lat - a.lat) / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(Math.max(0, 1 - h)))
}
export function proximityEligible(ticket: Ticket, technicianId: string, types: string[], tickets: Ticket[], now = Date.now()) {
  const target = unitPositions[ticket.location]
  const position = latestPosition(technicianId, tickets)
  return Boolean(ticket.modality === 'Presencial' && target && types.includes(ticket.callType ?? ticket.team) && freshPosition(position, now) && position && distanceKm(position, target) <= proximityDemo.radiusKm)
}
export function latestPosition(id: string, tickets: Ticket[]) {
  return tickets.flatMap(ticket => (ticket.positions ?? []).filter(position => (position.technicianId ?? ticket.technicianId) === id)).sort((a, b) => Date.parse(b.recordedAt) - Date.parse(a.recordedAt))[0]
}
export function recordDemoPosition(ticket: Ticket, now = Date.now()): Ticket {
  const target = unitPositions[ticket.location]
  if (!target || !ticket.technicianId || ticket.modality === 'Remoto' || ticket.executionState !== 'Em andamento') return ticket
  const interval = executionIntervals(ticket).find(item => item.endedAt === null)
  if (!interval) return ticket
  const positions = ticket.positions ?? []
  const last = positions[positions.length - 1]
  const started = Date.parse(interval.startedAt)
  if (last && Date.parse(last.recordedAt) >= started && now - Date.parse(last.recordedAt) < 600_000) return ticket
  // Um ponto observado agora; nunca inventa capturas durante o app fechado.
  return { ...ticket, positions: [...positions, { ...target, technicianId: ticket.technicianId, accuracy: 30, recordedAt: new Date(now).toISOString() }] }
}
