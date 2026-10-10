import { Navigate, Outlet } from 'react-router-dom'
import { getDemoUser, roleHome, type AccessRole } from '@/data/access-profiles'

export default function RequireAccess({ roles }: { roles?: AccessRole[] }) {
  const user = getDemoUser()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to={roleHome[user.role]} replace />
  return <Outlet />
}