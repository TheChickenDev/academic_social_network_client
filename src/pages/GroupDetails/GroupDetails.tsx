import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { GroupDetailsSidebar } from './components/GroupDetailsSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function MyAccount() {
  const { t } = useTranslation()

  return (
    <div className='mt-20'>
      <Helmet>
        <title>{t('pages.group')}</title>
      </Helmet>
      <SidebarProvider>
        <GroupDetailsSidebar />
      </SidebarProvider>
    </div>
  )
}
