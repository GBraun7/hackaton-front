import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/dashboard'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import TicketDetails from '@/components/tickets/TicketDetails'
import { demoAccounts, getDemoUser } from '@/data/access-profiles'
import { callTypes, serviceUnits } from '@/data/service-catalog'
import type { Ticket } from '@/data/tickets'
import { createMockTicket } from '@/services/mock-tickets'
import { useTickets } from '@/hooks/use-tickets'

const fieldClass = 'min-h-11 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700'
function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label>{children}</div>
}
export default function NewTicket() {
  const user = getDemoUser()
  const { error: storageError } = useTickets()
  const [unitId, setUnitId] = useState('')
  const [hasEquipment, setHasEquipment] = useState(false)
  const [needsMaterial, setNeedsMaterial] = useState(false)
  const [error, setError] = useState('')
  const [created, setCreated] = useState<Ticket | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const submitting = useRef(false)
  if (!user) return null
  const admin = user.role === 'administrador'
  const units = serviceUnits.filter(unit => admin || unit.secretary === user.secretary)
  const selectedUnit = units.find(unit => unit.id === unitId)
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current) return
    submitting.current = true
    const data = new FormData(event.currentTarget)
    const text = (key: string) => String(data.get(key) ?? '').trim()
    try {
      const ticket = createMockTicket({
        title: text('title'), description: text('description'), requesterId: text('requesterId'), unitId: text('unitId'),
        callType: text('callType'), nature: text('nature') as 'Hardware' | 'Software', modality: text('modality') as 'Presencial' | 'Remoto',
        contact: text('contact'), impact: text('impact'), urgency: text('urgency'),
        material: needsMaterial ? text('material') : '', pickupLocation: needsMaterial ? text('pickupLocation') : '',
        priority: (text('priority') || 'Normal') as Ticket['priority'],
        equipment: hasEquipment ? { label: text('equipmentLabel'), category: text('equipmentCategory'), brand: text('brand'), model: text('model'), asset: text('asset'), serial: text('serial') } : null,
      })
      setError(''); setCreated(ticket)
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível cadastrar o chamado.') }
    finally { submitting.current = false }
  }
  if (created) return <div className="space-y-6"><Card className="p-6"><h1 className="text-2xl font-semibold" role="status">Chamado #{created.id} cadastrado</h1><p className="mt-3 text-slate-600">A ordem de serviço digital foi salva neste navegador e está disponível nas visões autorizadas.</p><div className="mt-6 flex flex-wrap gap-3"><Button onClick={() => setDetailsOpen(true)}>Consultar ordem de serviço</Button><Button asChild variant="outline"><Link to={admin ? '/chamados' : '/meus-chamados'}>Acompanhar chamados</Link></Button><Button variant="ghost" onClick={() => { setCreated(null); setUnitId(''); setHasEquipment(false); setNeedsMaterial(false) }}>Cadastrar outro</Button></div></Card><Dialog open={detailsOpen} onOpenChange={setDetailsOpen}><DialogContent className="max-w-6xl"><TicketDetails ticket={created} /></DialogContent></Dialog></div>
  return <div className="max-w-4xl space-y-6"><div><h1 className="text-3xl font-semibold">Novo chamado</h1><p className="mt-2 text-sm text-slate-600">Registre a solicitação para consultar a ordem de serviço na web ou no celular.</p></div><p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">Demonstração: utilize dados fictícios. Chamados ficam salvos somente neste navegador, sem backend. Campos marcados com * são obrigatórios.</p><form onSubmit={handleSubmit} className="space-y-6"><Card className="space-y-5 p-5"><h2 className="font-semibold">Solicitante e local</h2><div className="grid gap-5 sm:grid-cols-2"><Field id="requesterId" label="Solicitante *">{admin ? <select id="requesterId" name="requesterId" required defaultValue="usuario-demo" className={fieldClass}>{demoAccounts.filter(account => account.role !== 'tecnico').map(account => <option key={account.id} value={account.id}>{account.name} — {account.secretary}</option>)}</select> : <><input type="hidden" name="requesterId" value={user.id} /><Input id="requesterId" value={user.name} readOnly /></>}</Field><Field id="contact" label="Ramal / contato *"><Input id="contact" name="contact" required maxLength={150} placeholder="Ramal ou contato de demonstração" /></Field><Field id="unitId" label="Unidade / local de atendimento *"><select id="unitId" name="unitId" className={fieldClass} required value={unitId} onChange={event => setUnitId(event.target.value)}><option value="">Selecione uma unidade</option>{units.map(unit => <option key={unit.id} value={unit.id}>{unit.secretary} — {unit.location}</option>)}</select></Field><div className="rounded-md bg-slate-50 p-3 text-sm"><p>Secretaria: <strong>{selectedUnit?.secretary ?? 'Selecione a unidade'}</strong></p><p className="mt-2">Departamento: {selectedUnit?.department ?? '—'}</p></div></div></Card><Card className="space-y-5 p-5"><h2 className="font-semibold">Problema e classificação</h2><Field id="title" label="Resumo do problema *"><Input id="title" name="title" required maxLength={120} placeholder="Ex.: cabo HDMI para instalação de painel" /></Field><Field id="description" label="Descrição *"><textarea id="description" name="description" required minLength={10} maxLength={4000} rows={4} className={fieldClass} placeholder="Descreva o problema, o que já foi tentado e o serviço necessário." /></Field><div className="grid gap-5 sm:grid-cols-3"><Field id="callType" label="Tipo de chamado *"><select id="callType" name="callType" required className={fieldClass}>{callTypes.map(type => <option key={type}>{type}</option>)}</select></Field><Field id="nature" label="Natureza *"><select id="nature" name="nature" required className={fieldClass}><option>Hardware</option><option>Software</option></select></Field><Field id="modality" label="Atendimento *"><select id="modality" name="modality" required className={fieldClass}><option>Presencial</option><option>Remoto</option></select></Field></div><Field id="impact" label="Impacto no serviço *"><textarea id="impact" name="impact" required maxLength={1000} rows={2} className={fieldClass} placeholder="Quem está sendo afetado? Existe alternativa para continuar o trabalho?" /></Field><Field id="urgency" label="Urgência informada *"><textarea id="urgency" name="urgency" required maxLength={1000} rows={2} className={fieldClass} placeholder="Informe prazo ou motivo da urgência." /></Field>{admin ? <Field id="priority" label="Prioridade *"><select id="priority" name="priority" required defaultValue="Normal" className={fieldClass}><option>Baixa</option><option>Normal</option><option>Alta</option></select></Field> : <p className="text-xs text-slate-500">A prioridade inicial será Normal. Impacto e urgência ficam registrados para triagem; a matriz de prioridade ainda não foi configurada.</p>}</Card><Card className="space-y-5 p-5"><h2 className="font-semibold">Equipamento e material</h2><div className="flex items-center gap-2"><input id="hasEquipment" type="checkbox" checked={hasEquipment} onChange={event => setHasEquipment(event.target.checked)} /><Label htmlFor="hasEquipment">Vincular equipamento</Label></div>{hasEquipment && <div className="grid gap-4 sm:grid-cols-2">{[['equipmentLabel', 'Etiqueta'], ['equipmentCategory', 'Categoria do equipamento'], ['brand', 'Marca'], ['model', 'Modelo'], ['asset', 'Patrimônio'], ['serial', 'Série']].map(([id, label]) => <Field key={id} id={id} label={label}><Input id={id} name={id} maxLength={150} /></Field>)}</div>}<div className="flex items-center gap-2"><input id="needsMaterial" type="checkbox" checked={needsMaterial} onChange={event => setNeedsMaterial(event.target.checked)} /><Label htmlFor="needsMaterial">Há necessidade de material</Label></div>{needsMaterial && <><Field id="material" label="Material necessário *"><Input id="material" name="material" required maxLength={300} placeholder="Ex.: cabo HDMI de 15 metros" /></Field><Field id="pickupLocation" label="Local de retirada, se conhecido"><Input id="pickupLocation" name="pickupLocation" maxLength={300} /></Field></>}</Card>{(error || storageError) && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">{error || storageError}</p>}<div className="flex gap-3"><Button type="submit" disabled={Boolean(storageError)}>Cadastrar chamado</Button><Button asChild variant="outline"><Link to={admin ? '/chamados' : '/meus-chamados'}>Cancelar</Link></Button></div></form></div>
}