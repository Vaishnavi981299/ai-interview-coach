import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Interview from './pages/Interview'
import Results from './pages/Results'
import Register from './pages/Register'
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/interview" element={<Interview />} />
      <Route path="/results" element={<Results />} />
    </Routes>
  )
}
export default App