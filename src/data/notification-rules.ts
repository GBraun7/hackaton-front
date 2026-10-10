import { proximityEligible } from '@/data/mock-positions'
import type { Ticket } from '@/data/tickets'
import { demoAccounts } from '@/data/access-profiles'
import { readTechnicians } from '@/data/technicians'
export type NoticeKind = 'novo' | 'vinculo' | 'conclusao' | 'pendencia' | 'devolucao'
export interface TicketNotice {
  id: string
  recipientId: string
  kind: NoticeKind
  ticketId: number
  at: string
  title: string
  message: string
}
// Os destinatários são registrados no momento do evento, não recalculados ao ler.
export function appendTicketNotices(ticket: Ticket, kind: NoticeKind, at: string, tickets: Ticket[] = []): Ticket {
  const technicians = readTechnicians()
  let recipients: string[] = []
  if (kind === 'novo' && !technicians.error) {
    const near = technicians.technicians.filter(tech => !tech.secretaries.includes(ticket.secretary) && tech.availability === 'Disponível' && proximityEligible(ticket, tech.id, tech.callTypes, tickets, Date.parse(at))).map(tech => tech.id)
    ticket = { ...ticket, proximityInvitees: near }
    recipients = [...technicians.technicians.filter(tech => tech.secretaries.includes(ticket.secretary) && tech.callTypes.includes(ticket.callType ?? ticket.team)).map(tech => tech.id), ...near]
  } else if (kind === 'vinculo' || kind === 'devolucao') {
    const id = ticket.technicianId ?? technicians.technicians.find(tech => tech.name === ticket.technician)?.id
    if (id) recipients = [id]
  } else if (kind === 'conclusao') {
    const id = ticket.requesterId ?? demoAccounts.find(account => account.name === ticket.requester)?.id
    if (id) recipients = [id]
  } else if (kind === 'pendencia') {
    recipients = demoAccounts.filter(account => account.role === 'administrador').map(account => account.id)
  }
  const titles: Record<NoticeKind, string> = { novo: 'Novo chamado da sua secretaria', vinculo: 'Chamado vinculado a você', conclusao: 'Serviço concluído: confirme a resolução', pendencia: 'Pendência aguardando sua análise', devolucao: 'Chamado devolvido para atendimento' }
  const messages: Record<NoticeKind, string> = { novo: `#${ticket.id} · ${ticket.title} · ${ticket.location} · ${ticket.callType ?? ticket.team}. Aviso de abertura, sem atribuição automática.`, vinculo: `#${ticket.id} · ${ticket.title}. Consulte sua fila; o atendimento não inicia automaticamente.`, conclusao: `#${ticket.id} · ${ticket.title}. Confirme e avalie ou informe se o problema continua.`, pendencia: `#${ticket.id} · ${ticket.title}. O solicitante informou que o problema continua.`, devolucao: `#${ticket.id} · ${ticket.title}. Consulte a orientação do administrador e continue o atendimento.` }
  const existing = ticket.notices ?? []
  const additions = [...new Set(recipients)].map(recipientId => ({ id: `${ticket.id}:${ticket.history.length}:${kind}:${recipientId}`, recipientId, kind, ticketId: ticket.id, at, title: kind === 'novo' && ticket.proximityInvitees?.includes(recipientId) ? 'Oportunidade voluntária por proximidade' : titles[kind], message: kind === 'novo' && ticket.proximityInvitees?.includes(recipientId) ? `#${ticket.id} · ${ticket.title} · ${ticket.location}. Convite voluntário: recusa ou ausência de resposta não gera penalidade. Elegibilidade será conferida no aceite.` : messages[kind] }))
  return { ...ticket, notices: [...existing, ...additions.filter(item => !existing.some(old => old.id === item.id))] }
}