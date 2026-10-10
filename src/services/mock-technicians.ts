import { demoAccounts, getDemoUser } from '@/data/access-profiles'
import { callTypes, serviceUnits } from '@/data/service-catalog'
import { availabilityOptions, persistTechnicians, readTechnicians, type Technician } from '@/data/technicians'
export type TechnicianInput = Omit<Technician, 'id' | 'updatedAt'>
export function saveMockTechnician(input: TechnicianInput, id?: string): Technician {
  if (getDemoUser()?.role !== 'administrador') throw new Error('Somente o administrador pode gerenciar técnicos.')
  const latest = readTechnicians()
  if (latest.error) throw new Error(latest.error)
  if (id && !latest.technicians.some(item => item.id === id)) throw new Error('Técnico não encontrado.')
  const name = input.name.trim(), email = input.email.trim().toLowerCase()
  if (name.length < 3 || name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || input.password.length < 6 || input.password.length > 100) throw new Error('Informe nome, e-mail válido e senha fictícia de 6 a 100 caracteres.')
  if (latest.technicians.some(item => item.id !== id && item.email.toLowerCase() === email) || demoAccounts.some(item => item.role !== 'tecnico' && item.email === email)) throw new Error('Este e-mail já está cadastrado.')
  const secretaries = [...new Set(input.secretaries)], types = [...new Set(input.callTypes)]
  if (!secretaries.length || secretaries.some(s => !serviceUnits.some(unit => unit.secretary === s)) || !types.length || types.some(s => !callTypes.includes(s as typeof callTypes[number]))) throw new Error('Selecione pelo menos uma secretaria e um tipo de chamado válidos.')
  if (!availabilityOptions.includes(input.availability) || (input.availability !== 'Disponível' && input.availabilityReason.trim().length < 5)) throw new Error('Indisponibilidade ou fim do expediente exige justificativa.')
  const technician: Technician = { ...input, id: id ?? `tecnico-${crypto.randomUUID()}`, name, email, secretaries, callTypes: types, availabilityReason: input.availabilityReason.trim(), updatedAt: new Date().toISOString() }
  const updated = id ? latest.technicians.map(item => item.id === id ? technician : item) : [...latest.technicians, technician]
  try { persistTechnicians(updated) } catch { throw new Error('Não foi possível salvar o técnico. Seus campos foram preservados; verifique o armazenamento.') }
  return technician
}