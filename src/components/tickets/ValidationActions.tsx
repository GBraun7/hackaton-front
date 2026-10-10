import { useRef, useState, type FormEvent } from 'react'
import type { Ticket } from '@/data/tickets'
import { getDemoUser } from '@/data/access-profiles'
import { validateMockTicket, type ValidationInput } from '@/services/mock-tickets'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
export default function ValidationActions({ ticket }: { ticket: Ticket }) {
  const user = getDemoUser()
  const [action, setAction] = useState<ValidationInput['action'] | null>(null)
  const [text, setText] = useState('')
  const [rating, setRating] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const pending = useRef(false)
  if (!user) return null
  const owner = ticket.requesterId ? ticket.requesterId === user.id : ticket.requester === user.name
  const canValidate = owner && user.role !== 'tecnico' && ticket.status === 'Aguardando validação'
  const canReview = user.role === 'administrador' && ticket.status === 'Aguardando análise'
  if (!canValidate && !canReview && !message) return null
  function choose(selected: ValidationInput['action']) { setAction(selected); setText(''); setRating(''); setError(''); setMessage('') }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!action || pending.current) return
    pending.current = true; setBusy(true); setError('')
    try {
      await validateMockTicket(ticket.id, { action, text, rating: rating ? Number(rating) : undefined })
      setMessage(action === 'confirmar' ? 'Resolução confirmada e avaliação salva.' : action === 'pendencia' ? 'Pendência registrada para análise do administrador.' : 'Pendência analisada. Atendimento devolvido à fila.'); setAction(null); setText('')
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível salvar.') }
    finally { pending.current = false; setBusy(false) }
  }
  return <section className="mt-5 rounded-lg border border-violet-200 bg-violet-50 p-4"><h3 className="font-semibold text-violet-950">{canReview ? 'Análise da pendência' : 'Validação da entrega'}</h3>{canValidate && <p className="mt-2 text-sm text-violet-950">O técnico concluiu o serviço. Confirme se o problema foi resolvido ou descreva o que ainda falta.</p>}{canReview && <p className="mt-2 whitespace-pre-wrap text-sm text-violet-950">Pendência do solicitante: {ticket.review?.reason}</p>}<div className="mt-3 flex flex-wrap gap-2">{canValidate && <><Button disabled={busy} onClick={() => choose('confirmar')}>Confirmar resolução e avaliar</Button><Button disabled={busy} variant="outline" onClick={() => choose('pendencia')}>O problema continua</Button></>}{canReview && <Button disabled={busy} onClick={() => choose('devolver')}>Devolver para atendimento</Button>}</div>{action && <form onSubmit={submit} className="mt-4 space-y-3">{action === 'confirmar' && <div className="space-y-2"><Label htmlFor="service-rating">Avaliação do atendimento *</Label><select id="service-rating" required value={rating} onChange={event => setRating(event.target.value)} disabled={busy} className="min-h-11 w-full rounded-md border bg-white px-3 text-sm"><option value="">Selecione uma nota</option>{['Muito insatisfeito', 'Insatisfeito', 'Regular', 'Satisfeito', 'Muito satisfeito'].map((label, index) => <option key={label} value={index + 1}>{index + 1} — {label}</option>)}</select></div>}<div className="space-y-2"><Label htmlFor="validation-description">{action === 'confirmar' ? 'Comentário (opcional)' : action === 'pendencia' ? 'Descreva o problema que continua *' : 'Orientação para continuidade *'}</Label><textarea id="validation-description" rows={3} required={action !== 'confirmar'} minLength={action !== 'confirmar' ? 5 : undefined} maxLength={2000} value={text} onChange={event => setText(event.target.value)} disabled={busy} className="w-full rounded-md border bg-white p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-700" /></div><div className="flex gap-2"><Button type="submit" disabled={busy}>{busy ? 'Salvando...' : 'Salvar'}</Button><Button type="button" variant="outline" disabled={busy} onClick={() => { setAction(null); setError('') }}>Cancelar</Button></div></form>}{error && <p role="alert" className="mt-3 text-sm text-rose-800">{error}</p>}{message && <p role="status" className="mt-3 text-sm text-violet-950">{message}</p>}</section>
}