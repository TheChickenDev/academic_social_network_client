import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { AdminDashboardSidebar } from './components/AdminDashboardSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { useContext, useEffect } from 'react'
import { AppContext } from '@/contexts/app.context'
import { useNavigate } from 'react-router-dom'
import paths from '@/constants/paths'

export default function AdminDashboard() {
  const { t } = useTranslation()
  const { isAdmin } = useContext(AppContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAdmin) {
      navigate(paths.home)
    }
  }, [])

  return (
    <div>
      <Helmet>
        <title>{t('pages.dashboard')}</title>
      </Helmet>
      <SidebarProvider>
        <AdminDashboardSidebar />
      </SidebarProvider>
    </div>
  )
}
