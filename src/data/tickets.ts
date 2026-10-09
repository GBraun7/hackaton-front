export const ticketStatuses = ['Aberto', 'Em andamento', 'Bloqueado', 'Aguardando validação', 'Resolvido'] as const
export type TicketStatus = typeof ticketStatuses[number]
export type Priority = 'Baixa' | 'Normal' | 'Alta'
export interface Ticket {
  id: number
  title: string
  description: string
  createdAt: string
  requester: string
  extension: string
  secretary: string
  department: string
  location: string
  team: string
  technician: string | null
  category: string
  priority: Priority
  status: TicketStatus
  equipment: { label: string; category: string; brand: string; model: string; asset: string; serial: string } | null
  blocker: string | null
  history: { at: string; author: string; text: string }[]
}
const units = [
  { secretary: 'Saúde', department: 'Departamento Regional de Saúde', location: 'Unidade de Saúde Borda do Campo' },
  { secretary: 'Educação', department: 'Departamento de Ensino', location: 'Escola Municipal Araucária' },
  { secretary: 'Administração', department: 'Atendimento ao Público', location: 'Prefeitura · Recepção' },
  { secretary: 'Cultura', department: 'Departamento de Cultura', location: 'Biblioteca Municipal' },
]
const samples: { title: string; description: string; team: string; category: string; status: TicketStatus; priority: Priority; blocker?: string }[] = [
  { title: 'Cabo HDMI para instalação de painel', description: 'Solicitação de um cabo HDMI de 15 metros para instalar um painel na unidade. Conferir disponibilidade e compatibilidade antes da entrega.', team: 'Aquisições / Estoque', category: 'Auxílio ao usuário', status: 'Em andamento', priority: 'Normal' },
  { title: 'Computador não inicia', description: 'Computador da recepção não liga após tentativa de reinício. Verificar alimentação e equipamento.', team: 'Suporte de TI', category: 'Computador', status: 'Aberto', priority: 'Alta' },
  { title: 'Impressora com papel preso', description: 'Impressora apresenta atolamento recorrente na bandeja de entrada.', team: 'Suporte de TI', category: 'Impressora', status: 'Em andamento', priority: 'Normal' },
  { title: 'Monitor não liga', description: 'Monitor sem imagem e sem indicador de energia. Solicitante já conferiu a tomada.', team: 'Suporte de TI', category: 'Monitor', status: 'Bloqueado', priority: 'Alta', blocker: 'Aguardando monitor de substituição no estoque.' },
  { title: 'Ponto de rede sem conexão', description: 'Ponto de rede da sala de atendimento sem conexão. Cabo substituído; aguardando confirmação do solicitante.', team: 'Redes', category: 'Conectividade', status: 'Aguardando validação', priority: 'Alta' },
  { title: 'Configuração de impressora', description: 'Configurar impressora compartilhada na estação de trabalho.', team: 'Suporte de TI', category: 'Impressora', status: 'Resolvido', priority: 'Baixa' },
  { title: 'Entrega de teclado', description: 'Substituição de teclado com teclas danificadas.', team: 'Aquisições / Estoque', category: 'Auxílio ao usuário', status: 'Aberto', priority: 'Baixa' },
  { title: 'Rede instável na unidade', description: 'Interrupções de conexão durante o atendimento ao público.', team: 'Redes', category: 'Conectividade', status: 'Em andamento', priority: 'Alta' },
  { title: 'Computador com lentidão', description: 'Aplicativos demoram para abrir e estação apresenta travamentos.', team: 'Suporte de TI', category: 'Computador', status: 'Aguardando validação', priority: 'Normal' },
  { title: 'Reposição de toner', description: 'Impressora sem toner para emissão de documentos.', team: 'Aquisições / Estoque', category: 'Suprimentos', status: 'Bloqueado', priority: 'Normal', blocker: 'Aguardando recebimento do material.' },
  { title: 'Instalação de ponto de rede', description: 'Instalação e teste de ponto de rede para estação de atendimento.', team: 'Redes', category: 'Conectividade', status: 'Resolvido', priority: 'Normal' },
  { title: 'Mouse com falha', description: 'Mouse não responde de forma consistente. Verificar e substituir se necessário.', team: 'Suporte de TI', category: 'Periféricos', status: 'Aberto', priority: 'Baixa' },
]
export const mockTickets: Ticket[] = samples.map((sample, index) => {
  const unit = units[index % units.length]
  const createdAt = `2026-10-${String(9 - Math.floor(index / 3)).padStart(2, '0')}T09:30:00-03:00`
  const requester = ['Ana Silva', 'Bruno Costa', 'Carla Souza', 'Diego Lima'][index % 4]
  const technician = sample.status === 'Aberto' ? null : sample.team === 'Aquisições / Estoque' ? 'Equipe de estoque' : sample.team === 'Redes' ? 'Pedro Almeida' : 'Camila Santos'
  const history = [{ at: createdAt, author: 'Atendente de demonstração', text: 'Chamado registrado e encaminhado à equipe responsável.' }]
  if (technician) history.push({ at: createdAt.replace('09:30', '10:15'), author: technician, text: 'Atendimento iniciado.' })
  if (sample.blocker) history.push({ at: createdAt.replace('09:30', '11:00'), author: technician ?? 'Equipe', text: sample.blocker })
  if (sample.status === 'Aguardando validação' || sample.status === 'Resolvido') history.push({ at: createdAt.replace('09:30', '11:30'), author: technician ?? 'Equipe', text: 'Serviço concluído pelo técnico. Aguardando confirmação do solicitante.' })
  if (sample.status === 'Resolvido') history.push({ at: createdAt.replace('09:30', '12:00'), author: requester, text: 'Resolução confirmada pelo solicitante.' })
  return { ...sample, ...unit, id: 14142 + index, createdAt, requester, technician, extension: '0000 (fictício)', blocker: sample.blocker ?? null, equipment: ['Computador', 'Monitor', 'Impressora'].includes(sample.category) ? { label: `DEMO-${String(index + 1).padStart(4, '0')}`, category: sample.category, brand: 'Marca de demonstração', model: 'Modelo padrão', asset: `PAT-DEMO-${index + 1}`, serial: `SERIE-DEMO-${index + 1}` } : null, history }
})
export const statusClasses: Record<TicketStatus, string> = {
  'Aberto': 'border-slate-200 bg-slate-100 text-slate-700',
  'Em andamento': 'border-blue-200 bg-blue-50 text-blue-800',
  'Bloqueado': 'border-amber-200 bg-amber-50 text-amber-900',
  'Aguardando validação': 'border-violet-200 bg-violet-50 text-violet-800',
  'Resolvido': 'border-emerald-200 bg-emerald-50 text-emerald-800',
}
export const priorityClasses: Record<Priority, string> = { Baixa: 'border-slate-200 bg-white text-slate-600', Normal: 'border-slate-200 bg-white text-slate-600', Alta: 'border-rose-200 bg-rose-50 text-rose-800' }
