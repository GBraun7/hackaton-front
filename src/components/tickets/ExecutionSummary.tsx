import { useEffect, useState } from 'react'
import type { Ticket } from '@/data/tickets'
import { activeSeconds, executionIntervals, formatDuration } from '@/lib/ticket-execution'
const date = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' })
export default function ExecutionSummary({ ticket }: { ticket: Ticket }) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    if (ticket.executionState !== 'Em andamento') return
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [ticket.executionState])
  const start = ticket.startedAt ?? executionIntervals(ticket)[0]?.startedAt
  return <section className="rounded-lg border bg-slate-50 p-4"><h3 className="text-sm font-semibold">Execução do atendimento</h3><p className="mt-2 text-sm text-slate-600">Etapa do atendimento: {ticket.executionState}</p><dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-xs text-slate-500">Tempo ativo (horas:minutos:segundos)</dt><dd className="mt-1 font-mono text-lg">{formatDuration(activeSeconds(ticket, ticket.executionState === 'Em andamento' ? Math.max(now, Date.now()) : now))}</dd></div><div><dt className="text-xs text-slate-500">Primeiro início</dt><dd className="mt-1">{start ? date.format(new Date(start)) : 'Ainda não iniciado'}</dd></div>{ticket.completedAt && <div><dt className="text-xs text-slate-500">Conclusão do técnico</dt><dd className="mt-1">{date.format(new Date(ticket.completedAt))}</dd></div>}</dl>{ticket.pauseReason && <p className="mt-3 whitespace-pre-wrap text-sm text-orange-900">Pausa: {ticket.pauseReason}</p>}<p className="mt-3 text-xs text-slate-500">Tempo soma apenas intervalos de execução; pausa e bloqueio interrompem a contagem. Os exemplos antigos utilizam horários fictícios do histórico.</p></section>
}