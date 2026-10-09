import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle, Table, TableCell, TableHead } from '@/components/ui/dashboard'

const tickets = [
  { id: 1048, title: 'Computador não inicia', location: 'Unidade de Saúde Central', team: 'Suporte de TI', status: 'Em andamento', age: 0 },
  { id: 1047, title: 'Impressora com papel preso', location: 'Secretaria de Educação', team: 'Suporte de TI', status: 'Aguardando validação', age: 1 },
  { id: 1046, title: 'Monitor sem imagem', location: 'Prefeitura · Recepção', team: 'Suporte de TI', status: 'Aberto', age: 1 },
  { id: 1045, title: 'Troca de luminária', location: 'Biblioteca Municipal', team: 'Manutenção', status: 'Bloqueado', age: 2 },
  { id: 1044, title: 'Ponto de rede sem conexão', location: 'Secretaria de Saúde', team: 'Redes', status: 'Resolvido', age: 3 },
  { id: 1043, title: 'Vistoria de acessibilidade', location: 'Centro de Atendimento', team: 'Vistorias', status: 'Resolvido', age: 5 },
  { id: 1042, title: 'Configuração de impressora', location: 'Secretaria de Finanças', team: 'Suporte de TI', status: 'Resolvido', age: 12 },
  { id: 1041, title: 'Manutenção de porta', location: 'Escola Municipal', team: 'Manutenção', status: 'Bloqueado', age: 18 },
  { id: 1040, title: 'Instalação de ponto de rede', location: 'Centro de Atendimento', team: 'Redes', status: 'Resolvido', age: 24 },
  { id: 1039, title: 'Vistoria predial', location: 'Biblioteca Municipal', team: 'Vistorias', status: 'Resolvido', age: 28 },
]
const statusClasses: Record<string, string> = {
  'Aberto': 'border-slate-200 bg-slate-100 text-slate-700',
  'Em andamento': 'border-blue-200 bg-blue-50 text-blue-800',
  'Aguardando validação': 'border-violet-200 bg-violet-50 text-violet-800',
  'Bloqueado': 'border-amber-200 bg-amber-50 text-amber-900',
  'Resolvido': 'border-emerald-200 bg-emerald-50 text-emerald-800',
}

export default function Dashboard() {
  const [period, setPeriod] = useState(30)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('Todos')
  const periodTickets = tickets.filter(ticket => ticket.age < period)
  const query = search.trim().toLocaleLowerCase('pt-BR')
  const filtered = periodTickets.filter(ticket => (status === 'Todos' || ticket.status === status) && `${ticket.id} ${ticket.title} ${ticket.location} ${ticket.team}`.toLocaleLowerCase('pt-BR').includes(query))
  const blocked = periodTickets.filter(ticket => ticket.status === 'Bloqueado').length
  const resolved = periodTickets.filter(ticket => ticket.status === 'Resolvido').length
  const cards = [
    { label: 'Chamados recebidos', value: periodTickets.length, detail: 'Registrados no período', icon: '▤', color: 'bg-slate-100 text-slate-700' },
    { label: 'Em andamento', value: periodTickets.filter(ticket => ticket.status === 'Em andamento').length, detail: 'Atendimento em execução', icon: '↗', color: 'bg-blue-50 text-blue-800' },
    { label: 'Resolvidos', value: resolved, detail: 'Resolução confirmada pelo solicitante', icon: '✓', color: 'bg-emerald-50 text-emerald-800' },
    { label: 'Bloqueados', value: blocked, detail: 'Precisam de apoio para continuar', icon: '!', color: 'bg-amber-50 text-amber-900' },
  ]
  const buckets = Array.from({ length: period === 7 ? 7 : 4 }, (_, index) => {
    const size = period === 7 ? 1 : 8
    const entries = periodTickets.filter(ticket => Math.min(Math.floor(ticket.age / size), 3) === index || (period === 7 && ticket.age === index))
    return period === 7 ? { label: index === 0 ? 'Hoje' : `${index}d atrás`, entries: periodTickets.filter(ticket => ticket.age === index) } : { label: index === 0 ? '0–7 dias' : index === 1 ? '8–15 dias' : index === 2 ? '16–23 dias' : '24–29 dias', entries }
  }).reverse()
  const maxVolume = Math.max(1, ...buckets.map(bucket => bucket.entries.length))
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-emerald-700">Painel de acompanhamento</p><h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1><p className="mt-2 text-sm text-slate-600">Uma visão do atendimento e das contribuições de cada equipe.</p></div><div aria-label="Período dos indicadores" className="flex gap-1 rounded-lg border bg-white p-1">{[7, 30].map(days => <Button key={days} size="sm" variant={period === days ? 'secondary' : 'ghost'} aria-pressed={period === days} onClick={() => setPeriod(days)} className={period === days ? 'bg-[#103c32] text-white hover:bg-[#185443]' : ''}>Últimos {days} dias</Button>)}</div></div>
      <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">Dados fictícios para demonstração. Os filtros funcionam sobre esta amostra; o painel ainda não está conectado ao backend.</p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(card => <Card key={card.label}><CardHeader className="flex flex-row items-center justify-between space-y-0"><CardDescription className="font-medium text-slate-600">{card.label}</CardDescription><span aria-hidden="true" className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg ${card.color}`}>{card.icon}</span></CardHeader><CardContent><p className="text-3xl font-semibold tracking-tight">{card.value}</p><p className="mt-2 text-xs leading-5 text-slate-500">{card.detail}</p></CardContent></Card>)}</div>
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card><CardHeader><CardTitle>Volume de chamados</CardTitle><CardDescription>Recebidos por intervalo nos últimos {period} dias</CardDescription></CardHeader><CardContent><div className="flex items-center gap-4 text-xs text-slate-600"><span className="flex items-center gap-2"><span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-[#185443]" />Recebidos</span></div><div className="mt-6 flex h-44 items-end gap-3 sm:gap-6" role="img" aria-label={buckets.map(bucket => `${bucket.label}: ${bucket.entries.length} chamados`).join('; ')}>{buckets.map(bucket => <div key={bucket.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><span className="text-xs font-medium text-slate-600">{bucket.entries.length}</span><div className="w-full max-w-16 rounded-t-md bg-[#185443]" style={{ height: `${bucket.entries.length / maxVolume * 110}px`, minHeight: bucket.entries.length ? 6 : 2 }} /><span className="whitespace-nowrap text-[10px] text-slate-500 sm:text-xs">{bucket.label}</span></div>)}</div><p className="mt-5 border-t pt-3 text-xs text-slate-500">{resolved} de {periodTickets.length} chamados do período com resolução confirmada.</p></CardContent></Card>
        <Card><CardHeader><CardTitle>Pontos de atenção</CardTitle><CardDescription>O que precisa de acompanhamento</CardDescription></CardHeader><CardContent className="space-y-4"><div className="rounded-lg border border-amber-200 bg-amber-50 p-4"><p className="text-sm font-semibold text-amber-950">{blocked} {blocked === 1 ? 'chamado bloqueado' : 'chamados bloqueados'}</p><p className="mt-1 text-xs leading-5 text-amber-900">Verifique materiais e dependências para retomar o atendimento.</p><Button variant="link" onClick={() => { setStatus('Bloqueado'); setSearch(''); document.getElementById('recent-tickets')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }} className="mt-2 h-auto p-0 text-xs text-amber-950">Ver chamados bloqueados →</Button></div><div className="rounded-lg border border-violet-200 bg-violet-50 p-4"><p className="text-sm font-semibold text-violet-950">{periodTickets.filter(ticket => ticket.status === 'Aguardando validação').length} aguardando validação</p><p className="mt-1 text-xs leading-5 text-violet-900">O serviço foi concluído pelo técnico e aguarda a confirmação do solicitante.</p></div></CardContent></Card>
      </div>
      <Card id="recent-tickets" className="scroll-mt-6"><CardHeader><div className="flex flex-wrap items-center justify-between gap-4"><div><CardTitle>Chamados recentes</CardTitle><CardDescription className="mt-1">Acompanhe o estado de cada atendimento.</CardDescription></div><div className="w-full sm:w-72"><Label htmlFor="ticket-search" className="sr-only">Buscar por número, chamado, local ou equipe</Label><Input id="ticket-search" type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar chamado, local ou equipe..." /></div></div><div className="flex flex-wrap gap-2 pt-3" aria-label="Filtrar chamados por status">{['Todos', ...Object.keys(statusClasses)].map(value => <Button key={value} size="sm" variant={status === value ? 'secondary' : 'ghost'} aria-pressed={status === value} onClick={() => setStatus(value)} className={status === value ? 'bg-emerald-50 text-[#103c32] hover:bg-emerald-100' : 'text-slate-500'}>{value}</Button>)}</div></CardHeader><Table><caption className="sr-only">Chamados dos últimos {period} dias filtrados por {status}</caption><thead className="border-y bg-slate-50"><tr><TableHead scope="col">Chamado</TableHead><TableHead scope="col">Equipe</TableHead><TableHead scope="col">Status</TableHead><TableHead scope="col" className="whitespace-nowrap">Registrado</TableHead></tr></thead><tbody>{filtered.map(ticket => <tr key={ticket.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50"><TableCell><p className="whitespace-nowrap font-medium"><span className="mr-2 text-xs text-slate-500">#{ticket.id}</span>{ticket.title}</p><p className="mt-1 text-xs text-slate-500">{ticket.location}</p></TableCell><TableCell className="whitespace-nowrap text-slate-600">{ticket.team}</TableCell><TableCell><Badge className={`whitespace-nowrap ${statusClasses[ticket.status]}`}>{ticket.status}</Badge></TableCell><TableCell className="whitespace-nowrap text-xs text-slate-500">{ticket.age === 0 ? 'Hoje' : `Há ${ticket.age} ${ticket.age === 1 ? 'dia' : 'dias'}`}</TableCell></tr>)}</tbody></Table>{filtered.length === 0 && <p role="status" className="p-8 text-center text-sm text-slate-500">Nenhum chamado encontrado. Ajuste a busca ou o filtro.</p>}<p aria-live="polite" className="border-t px-5 py-3 text-xs text-slate-500">{filtered.length} de {periodTickets.length} chamados no período</p></Card>
      <Card><CardHeader><CardTitle>Participação das equipes</CardTitle><CardDescription>Distribuição dos chamados recebidos no período</CardDescription></CardHeader><CardContent className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">{['Suporte de TI', 'Redes', 'Manutenção', 'Vistorias'].map(team => { const count = periodTickets.filter(ticket => ticket.team === team).length; return <div key={team}><div className="mb-3 flex justify-between text-sm"><span className="font-medium">{team}</span><span className="text-slate-500">{count}</span></div><div aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${count / periodTickets.length * 100}%` }} /></div><p className="mt-2 text-xs text-slate-500">{Math.round(count / periodTickets.length * 100)}% dos chamados</p></div> })}</CardContent></Card>
      <footer className="flex flex-wrap justify-between gap-2 pb-2 text-xs text-slate-500"><span>Missão SJP · Prefeitura de São José dos Pinhais</span><span>Protótipo · Dados de demonstração</span></footer>
    </div>
  )
}
