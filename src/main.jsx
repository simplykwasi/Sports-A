import './index.css'
import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ui/ErrorBoundary.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
