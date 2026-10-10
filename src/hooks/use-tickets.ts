import { useSyncExternalStore } from 'react'
import { getTicketsSnapshot, subscribeTickets } from '@/services/mock-tickets'
export function useTickets() { return useSyncExternalStore(subscribeTickets, getTicketsSnapshot) }