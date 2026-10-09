import { Badge } from '@/components/ui/dashboard'
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import TicketMap from '@/components/tickets/TicketMap'
import { priorityClasses, statusClasses, type Ticket } from '@/data/tickets'
const date = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' })

export default function TicketDetails({ ticket }: { ticket: Ticket }) {
  return <>
    <DialogHeader><p className="text-xs font-medium uppercase tracking-wider text-emerald-700">Ordem de serviço · #{ticket.id}</p><DialogTitle>{ticket.title}</DialogTitle><DialogDescription>Aberto em {date.format(new Date(ticket.createdAt))} · Dados fictícios</DialogDescription></DialogHeader>
    <div className="mt-4 flex flex-wrap gap-2"><Badge className={statusClasses[ticket.status]}>{ticket.status}</Badge><Badge className={priorityClasses[ticket.priority]}>Prioridade {ticket.priority.toLowerCase()}</Badge></div>
    <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1.15fr_1fr]">
      <div className="min-w-0 space-y-6">
        <section><h3 className="text-sm font-semibold">Descrição do problema</h3><p className="mt-2 text-sm leading-6 text-slate-600">{ticket.description}</p></section>
        <section className="rounded-lg border bg-slate-50 p-4"><h3 className="mb-4 text-sm font-semibold">Dados do atendimento</h3><dl className="grid gap-4 text-sm sm:grid-cols-2">{[['Solicitante', ticket.requester], ['Ramal / Contato', ticket.extension], ['Secretaria', ticket.secretary], ['Departamento', ticket.department], ['Unidade / Divisão', ticket.location], ['Problema / Categoria', ticket.category], ['Encaminhado para', ticket.team], ['Responsável pela execução', ticket.technician ?? 'Aguardando atribuição']].map(([label, value]) => <div key={label}><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 break-words font-medium">{value}</dd></div>)}</dl></section>
        <section><h3 className="text-sm font-semibold">Equipamentos</h3>{ticket.equipment ? <dl className="mt-3 grid gap-3 rounded-lg border p-4 text-sm sm:grid-cols-3">{Object.entries({ Etiqueta: ticket.equipment.label, Categoria: ticket.equipment.category, Marca: ticket.equipment.brand, Modelo: ticket.equipment.model, Patrimônio: ticket.equipment.asset, Série: ticket.equipment.serial }).map(([label, value]) => <div key={label}><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-1 break-words">{value}</dd></div>)}</dl> : <p className="mt-2 text-sm text-slate-500">Nenhum equipamento vinculado.</p>}</section>
        <section className={ticket.blocker ? 'rounded-lg border border-amber-200 bg-amber-50 p-4' : 'rounded-lg border p-4'}><h3 className="text-sm font-semibold">Pendências / Impedimentos</h3><p className="mt-1 text-sm leading-6 text-slate-600">{ticket.blocker ?? 'Nenhuma pendência registrada.'}</p></section>
        <section><h3 className="text-sm font-semibold">Histórico de execução</h3><ol className="mt-4 space-y-4 border-l border-emerald-200 pl-4">{ticket.history.map((entry, index) => <li key={index}><p className="text-xs text-slate-500">{date.format(new Date(entry.at))} · {entry.author}</p><p className="mt-1 text-sm leading-6 text-slate-700">{entry.text}</p></li>)}</ol></section>
      </div>
      <div className="min-w-0 lg:sticky lg:top-0"><TicketMap key={ticket.id} ticket={ticket} /></div>
    </div>
    <p className="mt-6 border-t pt-4 text-xs leading-5 text-slate-500">A conclusão do técnico encerra o rastreamento. A confirmação da resolução pelo solicitante permanece uma etapa separada.</p>
  </>
}
