import { useRef, useState, type FormEvent } from 'react'
import type { Ticket } from '@/data/tickets'
import { getDemoUser } from '@/data/access-profiles'
import { useTechnicians } from '@/hooks/use-technicians'
import { useTickets } from '@/hooks/use-tickets'
import { assignMockTicket } from '@/services/mock-tickets'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
export default function AssignmentActions({ ticket }: { ticket: Ticket }) {
  const { technicians, error: catalogError } = useTechnicians()
  const { tickets } = useTickets()
  const [selected, setSelected] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const pending = useRef(false)
  if (getDemoUser()?.role !== 'administrador') return null
  if (!['Aberto', 'Vinculado', 'Pausado', 'Bloqueado'].includes(ticket.status)) return null
  const candidates = technicians.filter(tech => tech.availability === 'Disponível' && tech.id !== ticket.technicianId && tech.name !== ticket.technician && tech.secretaries.includes(ticket.secretary) && tech.callTypes.includes(ticket.callType ?? ticket.team))
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (pending.current) return
    pending.current = true; setBusy(true); setError(''); setMessage('')
    try { await assignMockTicket(ticket.id, selected, reason); setSelected(''); setReason(''); setMessage('Responsável atualizado. Nenhum atendimento iniciado automaticamente.') }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível atribuir.') }
    finally { pending.current = false; setBusy(false) }
  }
  return <section className="mt-5 rounded-lg border bg-slate-50 p-4"><h3 className="font-semibold">{ticket.technician ? 'Transferir responsável' : 'Atribuir técnico'}</h3><p className="mt-2 text-xs text-slate-600">Somente técnicos da secretaria e do tipo de chamado. Técnico ocupado pode receber na fila; disponibilidade informada deve permitir atendimento. Pausa/bloqueio e justificativas são preservados na transferência.</p>{candidates.length ? <form onSubmit={submit} className="mt-3 space-y-3"><Label htmlFor="assignment-tech">Técnico *</Label><select id="assignment-tech" required value={selected} onChange={event => setSelected(event.target.value)} disabled={busy || Boolean(catalogError)} className="min-h-11 w-full rounded-md border bg-white px-3 text-sm"><option value="">Selecione</option>{candidates.map(tech => <option key={tech.id} value={tech.id}>{tech.name}{tickets.some(item => item.status === 'Em andamento' && (item.technicianId ? item.technicianId === tech.id : item.technician === tech.name)) ? ' — ocupado, receberá na fila' : ''}</option>)}</select><Label htmlFor="assignment-reason">Justificativa *</Label><textarea id="assignment-reason" required minLength={5} maxLength={2000} rows={2} disabled={busy} value={reason} onChange={event => setReason(event.target.value)} className="w-full rounded-md border bg-white p-3 text-sm" /><Button type="submit" disabled={busy || Boolean(catalogError)}>{busy ? 'Salvando...' : ticket.technician ? 'Transferir' : 'Atribuir'}</Button></form> : <p className="mt-3 text-sm text-slate-600">Nenhum outro técnico elegível. Confira secretarias, tipos e disponibilidade em Técnicos.</p>}{(error || catalogError) && <p role="alert" className="mt-3 text-sm text-rose-800">{error || catalogError}</p>}{message && <p role="status" className="mt-3 text-sm text-emerald-800">{message}</p>}</section>
}