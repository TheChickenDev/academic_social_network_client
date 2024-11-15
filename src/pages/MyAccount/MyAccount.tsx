import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { MyAccountSidebar } from './components/MyAccountSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function MyAccount() {
  const { t } = useTranslation()

  return (
    <div className='mt-20'>
      <Helmet>
        <title>{t('pages.home')}</title>
      </Helmet>
      <SidebarProvider>
        <MyAccountSidebar />
      </SidebarProvider>
    </div>
  )
}
