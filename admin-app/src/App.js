import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import store from './redux/store';
import ProtectedRoute from './components/ProtectedRoute';
import AdminNavbar from './components/AdminNavbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import About from './components/About';
import StudentManagement from './pages/StudentManagement';
import BranchManagement from './pages/BranchManagement';
import BannerManagement from './pages/BannerManagement';
import MaterialsManagement from './pages/MaterialsManagement';
import QuestionPapersManagement from './pages/QuestionPapersManagement';
import AnnouncementsManagement from './pages/AnnouncementsManagement';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <div className="flex flex-col min-h-screen">
                  <AdminNavbar />
                  <main className="flex-grow pt-16">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/students" element={<StudentManagement />} />
                      <Route path="/branches" element={<BranchManagement />} />
                      <Route path="/materials" element={<MaterialsManagement />} />
                      <Route path="/question-papers" element={<QuestionPapersManagement />} />
                      <Route path="/announcements" element={<AnnouncementsManagement />} />
                      <Route path="/banner" element={<BannerManagement />} />
                      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
                    </Routes>
                  </main>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>

        <ToastContainer position="bottom-right" autoClose={3000} />
      </Router>
    </Provider>
  );
}

export default App;
