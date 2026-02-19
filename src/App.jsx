import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import {
  Hotels, Expenses, Users,
  Rooms, Employees, Inventory,
  Bookings, Guests, MyBookings
} from './pages/PlaceholderPages';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Admin Routes */}
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/users" element={<Users />} />

              {/* Manager Routes */}
              <Route path="/rooms" element={<Rooms />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/inventory" element={<Inventory />} />

              {/* Receptionist Routes */}
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/guests" element={<Guests />} />

              {/* User Routes */}
              <Route path="/my-bookings" element={<MyBookings />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
