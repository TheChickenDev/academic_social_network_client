import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AppProvider from './contexts/app.context.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Buffer } from 'buffer'
import process from 'process'

const queryClient = new QueryClient()

window.Buffer = Buffer
window.process = process

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <App />
          </AppProvider>
          <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left' />
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  </GoogleOAuthProvider>
)
