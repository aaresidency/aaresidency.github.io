import { createContext, useContext } from 'react'
import type { AdminApi } from '../../lib/adminApi'

export const AdminApiContext = createContext<AdminApi | null>(null)

export function useAdminApi(): AdminApi {
  const api = useContext(AdminApiContext)
  if (!api) throw new Error('useAdminApi must be used inside the admin shell')
  return api
}
