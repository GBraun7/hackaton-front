import type { Ticket, TicketStatus } from '@/data/tickets'

// Etapas internas do atendimento; não são status do chamado.
export const executionStates = ['Aberto', 'Vinculado', 'Em andamento', 'Pausado', 'Bloqueado', 'Aguardando validação', 'Aguardando análise', 'Resolvido'] as const
export type ExecutionState = typeof executionStates[number]
export function statusForExecution(state: ExecutionState): TicketStatus {
  return state === 'Aberto' ? 'Em aberto' : state === 'Resolvido' ? 'Resolvido' : 'Em análise'
}
export function normalizeStoredTicket(value: unknown): unknown {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value
  const item = value as Record<string, unknown>
  // Só converte o contrato legado; dados novos incoerentes devem falhar na validação.
  if (item.executionState !== undefined) return value
  const state = executionStates.includes(item.status as ExecutionState) ? item.status : undefined
  if (!executionStates.includes(state as ExecutionState)) return value
  return { ...item, executionState: state, status: statusForExecution(state as ExecutionState) }
}
export function withTicketStatus(ticket: Ticket): Ticket {
  return { ...ticket, status: statusForExecution(ticket.executionState) }
}
