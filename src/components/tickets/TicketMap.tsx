import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/dashboard'
import type { Ticket } from '@/data/tickets'
import { getTrackingSnapshot, routeDistanceKm } from '@/data/ticket-tracking'

const clock = new Intl.DateTimeFormat('pt-BR', { timeStyle: 'medium', timeZone: 'America/Sao_Paulo' })
const date = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' })

export default function TicketMap({ ticket }: { ticket: Ticket }) {
  const [snapshot, setSnapshot] = useState(() => getTrackingSnapshot(ticket))
  const [tileError, setTileError] = useState(false)
  const container = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const lineRef = useRef<L.Polyline | null>(null)
  const technicianRef = useRef<L.CircleMarker | null>(null)
  const last = snapshot.points[snapshot.points.length - 1]
  const distance = routeDistanceKm(snapshot.points)

  useEffect(() => {
    if (ticket.status !== 'Em andamento') return
    const interval = window.setInterval(() => setSnapshot(getTrackingSnapshot(ticket)), 5000)
    return () => window.clearInterval(interval)
  }, [ticket])

  useEffect(() => {
    if (!container.current) return
    const initial = getTrackingSnapshot(ticket)
    const map = L.map(container.current, { scrollWheelZoom: false }).setView([initial.destination.lat, initial.destination.lng], 14)
    mapRef.current = map
    const tiles = L.tileLayer(import.meta.env.VITE_MAP_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: import.meta.env.VITE_MAP_ATTRIBUTION || '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)
    tiles.on('tileerror', () => setTileError(true))
    L.circleMarker([initial.destination.lat, initial.destination.lng], { radius: 9, color: '#b45309', fillColor: '#fbbf24', fillOpacity: 1, weight: 3 }).bindTooltip('Local do chamado (fictício)').addTo(map)
    lineRef.current = L.polyline([], { color: '#185443', weight: 5, opacity: 0.85 }).addTo(map)
    technicianRef.current = L.circleMarker([initial.destination.lat, initial.destination.lng], { radius: 8, color: '#ffffff', fillColor: '#2563eb', fillOpacity: 1, weight: 3 }).bindTooltip(initial.mode === 'live' ? 'Posição simulada do técnico' : 'Última posição registrada')
    if (initial.points.length) technicianRef.current.addTo(map)
    const bounds = L.latLngBounds(initial.points.map(point => [point.lat, point.lng] as [number, number])).extend([initial.destination.lat, initial.destination.lng])
    if (initial.points.length > 1) map.fitBounds(bounds, { padding: [35, 35], maxZoom: 15 })
    const observer = new ResizeObserver(() => map.invalidateSize())
    observer.observe(container.current)
    return () => { observer.disconnect(); map.remove(); mapRef.current = null; lineRef.current = null; technicianRef.current = null }
  }, [ticket])

  useEffect(() => {
    lineRef.current?.setLatLngs(snapshot.points.map(point => [point.lat, point.lng] as [number, number]))
    const position = snapshot.points[snapshot.points.length - 1]
    if (position) technicianRef.current?.setLatLng([position.lat, position.lng])
  }, [snapshot])

  function frameRoute() {
    const bounds = L.latLngBounds(snapshot.points.map(point => [point.lat, point.lng] as [number, number])).extend([snapshot.destination.lat, snapshot.destination.lng])
    mapRef.current?.fitBounds(bounds, { padding: [35, 35], maxZoom: 15 })
  }
  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50 p-4" aria-label="Mapa de acompanhamento do chamado">
      <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-semibold">{snapshot.mode === 'live' ? 'Acompanhamento do técnico' : snapshot.mode === 'history' ? 'Rota registrada' : 'Local do chamado'}</h3><Badge className={snapshot.mode === 'live' ? 'border-blue-200 bg-blue-50 text-blue-800' : 'border-slate-200 bg-white text-slate-600'}>{snapshot.mode === 'live' ? 'Simulação ao vivo' : snapshot.mode === 'history' ? 'Histórico' : 'Sem deslocamento'}</Badge></div>
      <p className="mt-2 text-xs leading-5 text-slate-600">{snapshot.mode === 'live' ? 'Posição fictícia atualizada a cada 5 segundos. O GPS do celular ainda não está conectado.' : snapshot.finishedAt ? 'Trajeto congelado na conclusão do técnico. Não acompanha sua localização atual.' : snapshot.mode === 'history' ? 'Último trajeto registrado antes do impedimento. A localização não está sendo atualizada.' : 'O rastreamento começa quando o técnico inicia o atendimento.'}</p>
      <div ref={container} className="relative isolate mt-4 h-72 w-full rounded-lg border bg-slate-100 sm:h-80" role="region" aria-label="Mapa interativo: trajeto fictício e local do chamado" />
      {tileError && <p role="status" className="mt-2 text-xs text-amber-900">O fundo do mapa não carregou. Verifique a conexão; os pontos e a rota continuam disponíveis.</p>}
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600"><span className="flex items-center gap-2"><span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-amber-400" />Local do chamado</span>{last && <><span className="flex items-center gap-2"><span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-blue-600" />{snapshot.mode === 'live' ? 'Técnico' : 'Última posição'}</span><span className="flex items-center gap-2"><span aria-hidden="true" className="h-1 w-4 rounded bg-emerald-800" />Trajeto registrado</span></>}</div>
      {last && <><dl className="mt-5 grid grid-cols-2 gap-4 text-sm"><div><dt className="text-xs text-slate-500">Distância registrada</dt><dd className="mt-1 font-semibold">{distance.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} km</dd></div><div><dt className="text-xs text-slate-500">Pontos registrados</dt><dd className="mt-1 font-semibold">{snapshot.points.length}</dd></div><div className="col-span-2"><dt className="text-xs text-slate-500">{snapshot.mode === 'live' ? 'Última atualização simulada' : 'Último registro'}</dt><dd className="mt-1">{snapshot.mode === 'live' ? clock.format(new Date(last.recordedAt)) : date.format(new Date(last.recordedAt))}{snapshot.mode === 'live' && snapshot.arrived ? ' · Chegou ao local' : ''}</dd></div><div className="col-span-2"><dt className="text-xs text-slate-500">Última latitude / longitude</dt><dd className="mt-1 font-mono text-xs">{last.lat.toFixed(6)}, {last.lng.toFixed(6)}</dd></div>{snapshot.finishedAt && <div className="col-span-2"><dt className="text-xs text-slate-500">Rastreamento encerrado</dt><dd className="mt-1">{date.format(new Date(snapshot.finishedAt))}</dd></div>}</dl><Button variant="outline" size="sm" className="mt-4 w-full" onClick={frameRoute}>Enquadrar trajeto</Button></>}
      <p className="mt-4 border-t pt-3 text-[11px] leading-5 text-slate-500">Coordenadas e trajetos fictícios. A linha conecta os pontos registrados e não representa uma rota calculada pelas ruas.</p>
    </section>
  )
}
