import type { Ticket } from '@/data/tickets'
import type { DemoUser } from '@/data/access-profiles'
export const pauseReasons = ['Aguardando material / terceiros', 'Interrupção por urgência autorizada', 'Intervalo', 'Fim de expediente'] as const
export function isAssignedTo(ticket: Ticket, user: DemoUser) {
  return ticket.technicianId ? ticket.technicianId === user.id : ticket.technician === user.name
}
export function executionIntervals(ticket: Ticket): NonNullable<Ticket['intervals']> {
  if (ticket.intervals) return ticket.intervals
  // Compatibilidade com os exemplos anteriores, sem apagar seus eventos.
  const start = ticket.history.find(entry => entry.text === 'Atendimento iniciado.')?.at
  if (!start) return []
  const end = ticket.status === 'Em andamento' ? null : ticket.history.find(entry => entry.at >= start && (entry.text.includes('Serviço concluído') || entry.text === ticket.blocker))?.at ?? start
  return [{ startedAt: start, endedAt: end }]
}
export function activeSeconds(ticket: Ticket, now = Date.now()) {
  return Math.floor(executionIntervals(ticket).reduce((sum, interval) => sum + Math.max(0, (interval.endedAt ? Date.parse(interval.endedAt) : now) - Date.parse(interval.startedAt)), 0) / 1000)
}
export function formatDuration(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds))
  return `${String(Math.floor(safe / 3600)).padStart(2, '0')}:${String(Math.floor(safe % 3600 / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`
}