import useRouteElements from './hooks/useRouteElements'
import ThemeProvider from '@/components/ThemeProvider'
import LanguageProvider from '@/components/LanguageProvider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'

function App() {
  const routes = useRouteElements()

  return (
    <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
      <LanguageProvider defaultLanguage='en' storageKey='vite-ui-language'>
        <TooltipProvider>{routes}</TooltipProvider>
        <Toaster />
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
