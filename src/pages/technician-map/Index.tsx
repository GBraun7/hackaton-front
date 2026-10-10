import { useEffect, useMemo, useState } from 'react'
import PositionMap from '@/components/tickets/PositionMap'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/dashboard'
import { useTechnicians } from '@/hooks/use-technicians'
import { useTickets } from '@/hooks/use-tickets'
import { freshPosition, latestPosition, proximityDemo } from '@/data/mock-positions'
import { activeSeconds, formatDuration, executionIntervals } from '@/lib/ticket-execution'
const date = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' })
export default function TechnicianMap() {
  const { technicians, error } = useTechnicians()
  const { tickets, error: ticketError } = useTickets()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [secretary, setSecretary] = useState('')
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 30_000); return () => window.clearInterval(timer) }, [])
  const rows = useMemo(() => technicians.filter(tech => !secretary || tech.secretaries.includes(secretary)).map(tech => {
    const own = tickets.filter(ticket => ticket.technicianId === tech.id)
    const ticket = own.find(item => item.executionState === 'Em andamento') ?? own.filter(item => ['Pausado', 'Bloqueado'].includes(item.executionState)).sort((a,b) => Date.parse(b.history[b.history.length - 1].at) - Date.parse(a.history[a.history.length - 1].at))[0]
    const position = latestPosition(tech.id, tickets)
    return { tech, ticket, position, fresh: freshPosition(position, now) }
  }), [technicians, secretary, tickets, now])
  const points = useMemo(() => rows.flatMap(row => row.position ? [{ ...row.position, id: row.tech.id, label: `${row.tech.name} · ${row.fresh ? 'Último registro válido' : 'Registro antigo/impreciso'}`, historical: !row.fresh }] : []), [rows])
  const selected = rows.find(row => row.tech.id === selectedId)
  const secrets = [...new Set(technicians.flatMap(tech => tech.secretaries))]
  return <div className="space-y-5"><h1 className="text-3xl font-semibold">Mapa dos técnicos</h1><p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">Posições fictícias nas unidades de demonstração. Capturas a cada 10 minutos enquanto a plataforma está aberta e há execução ativa. Pausa e conclusão interrompem novas capturas; o último registro permanece como histórico. Não há GPS em segundo plano.</p><p className="text-xs text-slate-600">Proximidade de demonstração: {proximityDemo.radiusKm} km, posição de até 15 minutos e precisão de até {proximityDemo.maxAccuracy} m. Valores operacionais ainda precisam ser definidos.</p>{(error || ticketError) && <p role="alert">{error || ticketError}</p>}<label className="block text-sm">Secretaria <select value={secretary} onChange={event => setSecretary(event.target.value)} className="ml-2 rounded border bg-white p-2"><option value="">Todas</option>{secrets.map(value => <option key={value}>{value}</option>)}</select></label><PositionMap points={points} onSelect={setSelectedId} /><div className="grid gap-3 md:grid-cols-2">{rows.map(row => <Card key={row.tech.id} className="space-y-2 p-4"><h2 className="font-semibold">{row.tech.name}</h2><p className="text-sm">{row.tech.secretaries.join(', ')} · {row.ticket ? `${row.ticket.status} · ${row.ticket.executionState}` : 'Sem atendimento ativo'} · Disponibilidade: {row.tech.availability}</p><p className="text-sm">{row.position ? `${row.fresh ? 'Última posição válida' : 'Posição antiga/imprecisa'} · ${date.format(new Date(row.position.recordedAt))} · ±${row.position.accuracy} m` : 'Localização indisponível'}</p><Button variant="outline" onClick={() => setSelectedId(row.tech.id)}>Ver técnico</Button></Card>)}</div>{!rows.length && <p role="status">Nenhum técnico nesta seleção.</p>}<Dialog open={Boolean(selected)} onOpenChange={open => { if (!open) setSelectedId(null) }}><DialogContent>{selected && <><DialogTitle>{selected.tech.name}</DialogTitle><DialogDescription>Dados e posição de demonstração. Foto ainda não cadastrada.</DialogDescription><div className="mt-4 space-y-3 text-sm"><p>Secretarias: {selected.tech.secretaries.join(', ')}</p><p>Disponibilidade informada: {selected.tech.availability}</p><p>Atendimento: {selected.ticket ? `#${selected.ticket.id} · ${selected.ticket.title} · ${selected.ticket.status} · ${selected.ticket.executionState}` : 'Sem atendimento ativo ou interrompido'}</p>{selected.ticket && <><p>Unidade: {selected.ticket.location}</p><p>Início: {selected.ticket.startedAt ? date.format(new Date(selected.ticket.startedAt)) : 'Consultar histórico'}</p><p>Tempo ativo: {formatDuration(activeSeconds(selected.ticket, now))}</p><p>Tempo interrompido desde o primeiro início: {formatDuration(Math.max(0, (now - Date.parse(executionIntervals(selected.ticket)[0]?.startedAt ?? new Date(now).toISOString())) / 1000 - activeSeconds(selected.ticket, now)))}</p></>}<p>{selected.position ? `${selected.fresh ? 'Última posição conhecida' : 'Registro antigo/impreciso'}: ${date.format(new Date(selected.position.recordedAt))} · ±${selected.position.accuracy} m · ${selected.position.lat}, ${selected.position.lng}` : 'Localização indisponível; nenhuma coordenada inventada.'}</p></div></>}</DialogContent></Dialog></div>
}
