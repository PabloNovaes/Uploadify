import React from 'react'
import ReactDOM from 'react-dom/client'
import { Router } from './Router.tsx'
import { FileProvider } from './contexts/filesContext.tsx'
import './globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FileProvider>
      <Router />
    </FileProvider>
  </React.StrictMode>,
)
