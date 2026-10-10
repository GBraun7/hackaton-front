import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { GeoPoint } from '@/data/ticket-tracking'
export interface MapPoint extends GeoPoint { id: string; label: string; historical?: boolean }
export default function PositionMap({ points, onSelect }: { points: MapPoint[]; onSelect?: (id: string) => void }) {
  const container = useRef<HTMLDivElement>(null)
  const [tileError, setTileError] = useState(false)
  useEffect(() => {
    if (!container.current) return
    const map = L.map(container.current, { scrollWheelZoom: false }).setView([-25.5346, -49.2038], 13)
    const tiles = L.tileLayer(import.meta.env.VITE_MAP_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: import.meta.env.VITE_MAP_ATTRIBUTION || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', maxZoom: 19 }).addTo(map)
    tiles.on('tileerror', () => setTileError(true))
    points.forEach(point => {
      const label = document.createElement('span'); label.textContent = point.label
      const marker = L.circleMarker([point.lat, point.lng], { radius: 10, color: point.historical ? '#92400e' : '#185443', fillOpacity: 0.8 }).bindTooltip(label).addTo(map)
      if (onSelect) marker.on('click', () => onSelect(point.id))
    })
    if (points.length) map.fitBounds(L.latLngBounds(points.map(point => [point.lat, point.lng] as [number, number])), { padding: [40, 40], maxZoom: 14 })
    const observer = new ResizeObserver(() => map.invalidateSize()); observer.observe(container.current)
    return () => { observer.disconnect(); map.remove() }
  }, [points, onSelect])
  return <><div ref={container} className="relative isolate h-80 rounded-lg border bg-slate-100" role="region" aria-label="Mapa de posições fictícias; informações também disponíveis em texto" />{tileError && <p role="status" className="mt-2 text-sm text-amber-900">O fundo do mapa não carregou. Consulte os registros em texto.</p>}</>
}
