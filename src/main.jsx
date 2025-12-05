import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './shared/contexts/AuthContext.jsx'
import AppRoutes from './app/routes/AppRoutes.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AppRoutes>
        <App />
       </AppRoutes>
    </AuthProvider>
  </StrictMode>,
)
