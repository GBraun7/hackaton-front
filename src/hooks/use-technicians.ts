import { useSyncExternalStore } from 'react'
import { getTechniciansSnapshot, subscribeTechnicians } from '@/data/technicians'
export function useTechnicians() { return useSyncExternalStore(subscribeTechnicians, getTechniciansSnapshot) }