//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { TasksProvider } from './contexts/TasksContext.tsx'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <AuthProvider>
      <TasksProvider>
        <BrowserRouter>
        <App/>
        </BrowserRouter>
      </TasksProvider>
    </AuthProvider>
  //</StrictMode>
)
