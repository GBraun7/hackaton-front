import { useMemo } from 'react'
import type { Ticket } from '@/data/tickets'
import { unitPositions, freshPosition } from '@/data/mock-positions'
import PositionMap from '@/components/tickets/PositionMap'
const date = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' })
export default function TicketMap({ ticket }: { ticket: Ticket }) {
  const last = ticket.positions?.[ticket.positions.length - 1]
  const destination = unitPositions[ticket.location]
  const points = useMemo(() => last ? [{ ...last, id: 'position', label: 'Última posição simulada', historical: !freshPosition(last) }] : destination ? [{ ...destination, id: 'unit', label: 'Unidade fictícia; sem posição do técnico' }] : [], [last, destination])
  return <section className="space-y-3 rounded-lg border bg-slate-50 p-4"><h3 className="font-semibold">Local de atendimento</h3><p className="text-sm">{ticket.location}</p>{ticket.modality === 'Remoto' ? <p className="text-sm">Atendimento remoto; proximidade não se aplica.</p> : <><PositionMap points={points} /><p className="text-xs">{last ? `${ticket.status === 'Em andamento' && freshPosition(last) ? 'Último registro válido' : 'Registro histórico; não é localização atual'}: ${date.format(new Date(last.recordedAt))} · ±${last.accuracy} m` : 'Localização do técnico indisponível.'}</p><p className="text-xs">Coordenadas fictícias. Simulação de captura a cada 10 minutos durante execução com a plataforma aberta; pausa/conclusão interrompem novas capturas.</p></>}</section>
}
