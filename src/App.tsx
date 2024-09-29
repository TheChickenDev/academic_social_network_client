import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useRouteElements from './hooks/useRouteElements'
import ThemeProvider from '@/components/ThemeProvider'

function App() {
  const routes = useRouteElements()

  return (
    <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
      {routes}
      <ToastContainer />
    </ThemeProvider>
  )
}

export default App
