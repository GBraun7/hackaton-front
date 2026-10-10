import { getDemoUser } from '@/data/access-profiles'
import type { TicketNotice } from '@/data/notification-rules'
import { getTicketsSnapshot, subscribeTickets } from '@/services/mock-tickets'
const readStorageKey = 'missao-sjp.mock-notification-reads.v1'
type NoticeSnapshot = { notices: TicketNotice[]; readIds: string[]; error: string | null }
let cachedTickets: ReturnType<typeof getTicketsSnapshot> | undefined
let cachedRaw: string | null | undefined
let snapshot: NoticeSnapshot = { notices: [], readIds: [], error: null }
const listeners = new Set<() => void>()
export function getNotificationsSnapshot(): NoticeSnapshot {
  const tickets = getTicketsSnapshot()
  let raw: string | null
  try { raw = window.localStorage.getItem(readStorageKey) }
  catch { raw = '__storage_unavailable__' }
  if (cachedTickets === tickets && cachedRaw === raw) return snapshot
  cachedTickets = tickets; cachedRaw = raw
  let readIds: string[] = [], error = tickets.error
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed) || !parsed.every(id => typeof id === 'string')) throw new Error('invalid')
    readIds = parsed
  } catch { error = 'Não foi possível ler os avisos marcados como lidos. Verifique o armazenamento; os registros existentes serão preservados.' }
  snapshot = { notices: tickets.tickets.flatMap(ticket => ticket.notices ?? []).sort((a, b) => b.at.localeCompare(a.at)), readIds, error }
  return snapshot
}
function refresh() { getNotificationsSnapshot(); listeners.forEach(listener => listener()) }
subscribeTickets(refresh)
window.addEventListener('storage', event => { if (event.key === readStorageKey || event.key === null) refresh() })
export function subscribeNotifications(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener) } }
export function markNoticesRead(ids: string[]) {
  const user = getDemoUser()
  if (!user) throw new Error('Entre novamente para continuar.')
  const latest = getNotificationsSnapshot()
  if (latest.error) throw new Error(latest.error)
  const owned = latest.notices.filter(notice => notice.recipientId === user.id).map(notice => notice.id)
  if (ids.some(id => !owned.includes(id))) throw new Error('Você não pode alterar avisos de outra conta.')
  try { window.localStorage.setItem(readStorageKey, JSON.stringify([...new Set([...latest.readIds, ...ids])])) }
  catch { throw new Error('Não foi possível marcar os avisos como lidos. Tente novamente.') }
  refresh()
}