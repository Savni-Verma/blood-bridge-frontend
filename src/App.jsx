import { Routes, Route, Navigate } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import DonorProfile from './pages/DonorProfile'
import Search from './pages/Search'
import Requests from './pages/Requests'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/donor-profile" element={<DonorProfile />} />
      <Route path="/search" element={<Search />} />
      <Route path="/requests" element={<Requests />} />
    </Routes>
  )
}

export default App