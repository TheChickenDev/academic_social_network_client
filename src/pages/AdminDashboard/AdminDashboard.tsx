import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { AdminDashboardSidebar } from './components/AdminDashboardSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function AdminDashboard() {
  const { t } = useTranslation()

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
