 import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import AuthContext, { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ShieldCheck, Home, PlusCircle, User, LogOut } from 'lucide-react';

import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import CitizenDashboard from './pages/CitizenDashboard';
import HomePage from './pages/Home';
import ReportPage from './pages/Report';
import AdminPage from './pages/Admin';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </Router>
  );
}

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  // Hide navbar on login/register pages AND Dashboards (since they have their own sidebars)
  const hideNav = ['/login', '/register', '/unauthorized', '/admin-dashboard', '/officer-dashboard', '/citizen-dashboard'].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {!hideNav && (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center gap-2">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <ShieldCheck className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900 tracking-tight">Road<span className="text-blue-600">Fix</span></span>
                </Link>
              </div>

              <div className="hidden md:flex items-center space-x-4">
                <Link to="/" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1">
                  <Home className="w-4 h-4" /> Home
                </Link>

                {user ? (
                  <>
                    {user.role === 'citizen' && (
                      <Link to="/citizen-dashboard" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                    )}
                    {user.role === 'officer' && (
                      <Link to="/officer-dashboard" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Officer Portal</Link>
                    )}
                    {user.role === 'admin' && (
                      <Link to="/admin-dashboard" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Admin Panel</Link>
                    )}

                    <Link to="/report" className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 flex items-center gap-1 shadow-sm transition-all hover:-translate-y-0.5">
                      <PlusCircle className="w-4 h-4" /> Report Issue
                    </Link>

                    <div className="flex items-center gap-3 pl-4 border-l border-gray-200 ml-2">
                      <div className="text-right hidden lg:block">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                      </div>
                      <button onClick={logout} className="text-gray-400 hover:text-red-600 transition-colors" title="Logout">
                        <LogOut className="w-5 h-5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link to="/login" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                  </div>
                )}
              </div>

              {/* Mobile menu button could go here */}
            </div>
          </div>
        </nav>
      )}

      <main className="flex-grow">
        <AppRoutes />
      </main>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/map" element={<AdminPage />} />

      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route path="/admin-dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/officer-dashboard" element={<ProtectedRoute roles={['officer']}><OfficerDashboard /></ProtectedRoute>} />
      <Route path="/citizen-dashboard" element={<ProtectedRoute roles={['citizen']}><CitizenDashboard /></ProtectedRoute>} />
      <Route path="/report" element={<ProtectedRoute roles={['citizen', 'officer', 'admin']}><ReportPage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
