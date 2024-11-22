import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { SidebarProvider } from '@/components/ui/sidebar'
import SearchSidebar from './components/SearchSidebar'

export default function MyAccount() {
  const { t } = useTranslation()

  return (
    <div className='mt-20'>
      <Helmet>
        <title>{t('pages.search')}</title>
      </Helmet>
      <SidebarProvider>
        <SearchSidebar />
      </SidebarProvider>
    </div>
  )
}
