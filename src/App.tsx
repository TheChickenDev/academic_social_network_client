import useRouteElements from './hooks/useRouteElements'
import ThemeProvider from '@/components/ThemeProvider'
import LanguageProvider from '@/components/LanguageProvider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { HelmetProvider } from 'react-helmet-async'

function App() {
  const routes = useRouteElements()

  return (
    <HelmetProvider>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            {routes}
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}

export default App
