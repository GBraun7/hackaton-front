import { useRef, useState, type FormEvent } from 'react'
import type { Ticket } from '@/data/tickets'
import { getDemoUser } from '@/data/access-profiles'
import { isAssignedTo, pauseReasons } from '@/lib/ticket-execution'
import { actOnMockTicket, type TechnicianAction } from '@/services/mock-tickets'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
export default function TechnicianActions({ ticket }: { ticket: Ticket }) {
  const user = getDemoUser()
  const [action, setAction] = useState<'evento' | 'pausar' | 'bloquear' | 'concluir' | null>(null)
  const [text, setText] = useState('')
  const [category, setCategory] = useState<string>(pauseReasons[0])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const pending = useRef(false)
  if (!user || user.role !== 'tecnico') return null
  const own = isAssignedTo(ticket, user)
  const canClaim = ticket.status === 'Aberto' && !ticket.technician && ((user.secretaries ?? [user.secretary]).includes(ticket.secretary) || Boolean(ticket.proximityInvitees?.includes(user.id))) && Boolean(user.callTypes?.includes(ticket.callType ?? ticket.team))
  const active = own && ticket.status === 'Em andamento'
  const canEvent = own && ['Em andamento', 'Pausado', 'Bloqueado'].includes(ticket.status)
  async function execute(selected: TechnicianAction) {
    if (pending.current) return
    pending.current = true; setBusy(true); setError(''); setMessage('')
    try {
      await actOnMockTicket(ticket.id, { action: selected, text, pauseCategory: category })
      setMessage('Alteração salva no chamado.'); setAction(null); setText('')
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível salvar a alteração.') }
    finally { pending.current = false; setBusy(false) }
  }
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (action) void execute(action) }
  function choose(selected: typeof action) { setAction(selected); setText(''); setError(''); setMessage('') }
  return <section className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 p-4"><h3 className="font-semibold text-emerald-950">Ações do técnico</h3><div className="mt-3 flex flex-wrap gap-2">{canClaim && <Button disabled={busy} onClick={() => void execute('assumir')}>{ticket.proximityInvitees?.includes(user.id) ? 'Aceitar convite voluntário' : 'Assumir chamado'}</Button>}{own && ticket.status === 'Vinculado' && <Button disabled={busy} onClick={() => void execute('iniciar')}>Iniciar atendimento</Button>}{own && ['Pausado', 'Bloqueado'].includes(ticket.status) && <Button disabled={busy} onClick={() => void execute('retomar')}>Retomar atendimento</Button>}{canEvent && <Button disabled={busy} variant="outline" onClick={() => choose('evento')}>Registrar evento</Button>}{active && <><Button disabled={busy} variant="outline" onClick={() => choose('pausar')}>Pausar</Button><Button disabled={busy} variant="outline" onClick={() => choose('bloquear')}>Bloquear</Button><Button disabled={busy} onClick={() => choose('concluir')}>Concluir serviço</Button></>}</div>{own && ['Aguardando validação', 'Resolvido'].includes(ticket.status) && <p className="mt-3 text-sm text-emerald-950">{ticket.status === 'Resolvido' ? 'Resolução confirmada.' : 'Serviço concluído. Aguardando confirmação do solicitante.'}</p>}{action && <form onSubmit={submit} className="mt-4 space-y-3">{action === 'pausar' && <div className="space-y-2"><Label htmlFor="pause-category">Motivo da pausa</Label><select id="pause-category" value={category} onChange={event => setCategory(event.target.value)} className="min-h-11 w-full rounded-md border bg-white px-3 text-sm">{pauseReasons.map(reason => <option key={reason}>{reason}</option>)}</select></div>}<div className="space-y-2"><Label htmlFor="execution-description">{action === 'concluir' ? 'Descreva o serviço realizado' : action === 'bloquear' ? 'Justificativa do bloqueio' : action === 'pausar' ? 'Detalhes da pausa' : 'Descrição do andamento'}</Label><textarea id="execution-description" required minLength={5} maxLength={2000} rows={3} value={text} onChange={event => setText(event.target.value)} disabled={busy} className="w-full rounded-md border bg-white p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700" /></div>{action === 'concluir' && <p className="text-xs text-emerald-950">A conclusão encerra o tempo ativo e envia o chamado para validação do solicitante; não marca como Resolvido.</p>}<div className="flex gap-2"><Button type="submit" disabled={busy}>{busy ? 'Salvando...' : 'Salvar'}</Button><Button type="button" variant="outline" disabled={busy} onClick={() => choose(null)}>Cancelar</Button></div></form>}{error && <p role="alert" className="mt-3 text-sm text-rose-800">{error}</p>}{message && <p role="status" className="mt-3 text-sm text-emerald-950">{message}</p>}<p className="mt-3 text-xs text-emerald-950">Simulação local. GPS e push ainda não estão implementados.</p></section>
}