import { Navigate, Outlet, useLocation } from "react-router"
import { useAuthStore } from "@/stores/auth-store"
import { getPortalForRole } from "@/lib/role-guards"
import type { UserRole } from "@/types/user"

export function RequireAuth() {
  const { user, isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

export function RequireRole({ allowedRoles }: { allowedRoles: UserRole[] }) {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getPortalForRole(user.role)} replace />
  }

  return <Outlet />
}

export function RootRedirect() {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />
  }

  return <Navigate to={getPortalForRole(user.role)} replace />
}
