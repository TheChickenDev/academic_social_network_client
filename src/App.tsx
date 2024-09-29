import { ToastContainer } from 'react-toastify'
import useRouteElements from './hooks/useRouteElements'
import ThemeProvider from '@/components/ThemeProvider'

function App() {
  const routes = useRouteElements()

  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      {routes}
      <ToastContainer />
    </ThemeProvider>
  )
}

export default App
