import { callTypes, serviceUnits } from '@/data/service-catalog'
export const availabilityOptions = ['Disponível', 'Indisponível', 'Fora do expediente'] as const
export interface Technician {
  id: string
  name: string
  email: string
  password: string
  secretaries: string[]
  callTypes: string[]
  availability: typeof availabilityOptions[number]
  availabilityReason: string
  updatedAt: string
}
export const technicianStorageKey = 'missao-sjp.mock-technicians.v1'
const initial: Technician[] = [
  { id: 'tecnico-demo', name: 'Camila Santos', email: 'tecnico@demo.sjp', password: 'Tecnico123!', secretaries: ['Saúde'], callTypes: [...callTypes], availability: 'Disponível', availabilityReason: '', updatedAt: '2026-10-09T08:00:00-03:00' },
  { id: 'tecnico-redes-demo', name: 'Pedro Almeida', email: 'pedro@demo.sjp', password: 'Tecnico123!', secretaries: ['Saúde', 'Educação'], callTypes: ['Redes', 'TI'], availability: 'Disponível', availabilityReason: '', updatedAt: '2026-10-09T08:00:00-03:00' },
  { id: 'tecnico-estoque-demo', name: 'Equipe de estoque', email: 'estoque@demo.sjp', password: 'Tecnico123!', secretaries: [...new Set(serviceUnits.map(unit => unit.secretary))], callTypes: ['Aquisição/Estoque'], availability: 'Disponível', availabilityReason: '', updatedAt: '2026-10-09T08:00:00-03:00' },
]
const listeners = new Set<() => void>()
function read() {
  try {
    const raw = window.localStorage.getItem(technicianStorageKey)
    if (!raw) return { technicians: initial, error: null }
    const value: unknown = JSON.parse(raw)
    if (!Array.isArray(value) || !value.every(item => item && typeof item.id === 'string' && typeof item.name === 'string' && typeof item.email === 'string' && typeof item.password === 'string' && typeof item.availabilityReason === 'string' && Number.isFinite(Date.parse(item.updatedAt)) && Array.isArray(item.secretaries) && item.secretaries.length && item.secretaries.every((s: unknown) => typeof s === 'string') && Array.isArray(item.callTypes) && item.callTypes.length && item.callTypes.every((s: unknown) => callTypes.includes(s as typeof callTypes[number])) && availabilityOptions.includes(item.availability)) || new Set(value.map(item => item.id)).size !== value.length || new Set(value.map(item => item.email.toLowerCase())).size !== value.length) throw new Error('invalid')
    return { technicians: value as Technician[], error: null }
  } catch { return { technicians: initial, error: 'Não foi possível ler o cadastro de técnicos salvo. A amostra está sendo exibida; alterações estão bloqueadas para preservar os dados.' } }
}
let snapshot = read()
export function getTechniciansSnapshot() { return snapshot }
export function readTechnicians() { return read() }
export function subscribeTechnicians(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener) } }
export function persistTechnicians(technicians: Technician[]) {
  window.localStorage.setItem(technicianStorageKey, JSON.stringify(technicians))
  snapshot = { technicians, error: null }; listeners.forEach(listener => listener())
}
window.addEventListener('storage', event => { if (event.key === technicianStorageKey || event.key === null) { snapshot = read(); listeners.forEach(listener => listener()) } })