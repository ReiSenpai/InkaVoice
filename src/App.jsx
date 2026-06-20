import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './components/LoginPage'
import MobileLayout from './components/MobileLayout'
import RegisterPage from './components/RegisterPage'

function App() {
  return (
    <BrowserRouter>
      <MobileLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
        </Routes>
      </MobileLayout>
    </BrowserRouter>
  )
}

export default App
