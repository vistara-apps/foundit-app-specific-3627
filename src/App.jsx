import React from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import AppRouter from './components/AppRouter'

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <div className="min-h-screen bg-bg">
          <AppRouter />
        </div>
      </DataProvider>
    </AuthProvider>
  )
}

export default App