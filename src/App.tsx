import useRouteElements from './hooks/useRouteElements'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'
import { HelmetProvider } from 'react-helmet-async'

function App() {
  const routes = useRouteElements()

  return (
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        {routes}
      </TooltipProvider>
    </HelmetProvider>
  )
}

export default App
