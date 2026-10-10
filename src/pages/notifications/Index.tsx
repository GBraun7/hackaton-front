import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, Badge } from '@/components/ui/dashboard'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import TicketDetails from '@/components/tickets/TicketDetails'
import { getDemoUser } from '@/data/access-profiles'
import { isAssignedTo } from '@/lib/ticket-execution'
import { useNotifications } from '@/hooks/use-notifications'
import { useTickets } from '@/hooks/use-tickets'
import { markNoticesRead } from '@/services/mock-notifications'
const date = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' })
export default function Notifications() {
  const user = getDemoUser()
  const { notices, readIds, error } = useNotifications()
  const { tickets } = useTickets()
  const [onlyUnread, setOnlyUnread] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [actionError, setActionError] = useState('')
  const [message, setMessage] = useState('')
  if (!user) return null
  const own = notices.filter(notice => notice.recipientId === user.id)
  const unread = own.filter(notice => !readIds.includes(notice.id))
  const filtered = onlyUnread ? unread : own
  function canRead(ticket: typeof tickets[number]) {
    if (user!.role === 'administrador') return true
    if (user!.role === 'usuario') return ticket.requesterId ? ticket.requesterId === user!.id : ticket.requester === user!.name
    return isAssignedTo(ticket, user!) || (ticket.status === 'Aberto' && ((user!.secretaries ?? [user!.secretary]).includes(ticket.secretary) || Boolean(ticket.proximityInvitees?.includes(user!.id))) && Boolean(user!.callTypes?.includes(ticket.callType ?? ticket.team)))
  }
  const selected = tickets.find(ticket => ticket.id === selectedId && canRead(ticket))
  function mark(ids: string[]) { try { markNoticesRead(ids); setActionError(''); return true } catch (cause) { setActionError(cause instanceof Error ? cause.message : 'Não foi possível atualizar.'); return false } }
  function open(id: number, noticeId: string) {
    setMessage('')
    const ticket = tickets.find(item => item.id === id)
    if (!ticket || !canRead(ticket)) { setMessage('Este chamado não está mais disponível para seu perfil. Ele pode ter sido assumido ou transferido.'); return }
    mark([noticeId]); setSelectedId(id)
  }
  return <div className="space-y-6"><div className="flex flex-wrap justify-between gap-3"><div><h1 className="text-3xl font-semibold">Notificações</h1><p className="mt-2 text-sm text-slate-600">{unread.length} não lidas · {own.length} avisos da sua conta</p></div><Button variant="outline" disabled={!unread.length || Boolean(error)} onClick={() => mark(unread.map(notice => notice.id))}>Marcar todas como lidas</Button></div><p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">Avisos simulados e persistidos neste navegador. Não são push no celular. Novos eventos geram avisos; exemplos antigos não recebem notificações retroativas. Aviso não atribui nem inicia atendimento.</p><Button variant={onlyUnread ? 'secondary' : 'outline'} aria-pressed={onlyUnread} onClick={() => setOnlyUnread(!onlyUnread)}>Somente não lidas</Button>{(error || actionError) && <p role="alert" className="text-sm text-rose-800">{error || actionError}</p>}{message && <p role="status" className="text-sm text-slate-600">{message}</p>}<div className="space-y-3">{filtered.map(notice => <Card key={notice.id} className={`space-y-3 p-5 ${!readIds.includes(notice.id) ? 'border-emerald-200 bg-emerald-50/40' : ''}`}><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-semibold">{notice.title}</h2><Badge>{readIds.includes(notice.id) ? 'Lida' : 'Não lida'}</Badge></div><p className="text-sm text-slate-600">{notice.message}</p><p className="text-xs text-slate-500">{date.format(new Date(notice.at))}</p><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => open(notice.ticketId, notice.id)}>Abrir ordem de serviço</Button>{!readIds.includes(notice.id) && <Button variant="ghost" disabled={Boolean(error)} onClick={() => mark([notice.id])}>Marcar como lida</Button>}</div></Card>)}</div>{!filtered.length && <Card className="p-8 text-center"><p role="status">{onlyUnread ? 'Nenhuma notificação não lida.' : 'Nenhuma notificação nesta conta. Os próximos eventos de atendimento aparecerão aqui.'}</p></Card>}<Dialog open={Boolean(selected)} onOpenChange={open => { if (!open) setSelectedId(null) }}><DialogContent className="max-w-6xl">{selected && <TicketDetails ticket={selected} />}</DialogContent></Dialog></div>
}