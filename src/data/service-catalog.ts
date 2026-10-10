// Catálogo fictício; não representa o organograma oficial municipal.
export const serviceUnits = [
  { id: 'saude-borda', secretary: 'Saúde', department: 'Departamento Regional de Saúde', location: 'Unidade de Saúde Borda do Campo' },
  { id: 'saude-hospital', secretary: 'Saúde', department: 'Atendimento Hospitalar', location: 'Hospital Municipal (demonstração)' },
  { id: 'educacao-escola', secretary: 'Educação', department: 'Departamento de Ensino', location: 'Escola Municipal Araucária' },
  { id: 'administracao', secretary: 'Administração', department: 'Atendimento ao Público', location: 'Prefeitura · Recepção' },
  { id: 'cultura', secretary: 'Cultura', department: 'Departamento de Cultura', location: 'Biblioteca Municipal' },
] as const
export const callTypes = ['Aquisição/Estoque', 'Suporte de TI', 'Redes', 'TI'] as const
export function normalizeCallType(value: string): string {
  const legacy: Record<string, string> = { 'Aquisições / Estoque': 'Aquisição/Estoque', 'Aquisição / Estoque': 'Aquisição/Estoque', 'Suporte': 'Suporte de TI', 'Telecom': 'Redes', 'TI / Sistemas': 'TI' }
  return legacy[value] ?? value
}