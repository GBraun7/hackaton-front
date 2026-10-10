import { useSyncExternalStore } from 'react'
import { getNotificationsSnapshot, subscribeNotifications } from '@/services/mock-notifications'
export function useNotifications() { return useSyncExternalStore(subscribeNotifications, getNotificationsSnapshot) }