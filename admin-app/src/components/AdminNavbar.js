import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/authSlice';
import { FiMenu, FiX, FiLogOut, FiHome } from 'react-icons/fi';

export const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const navLinks = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Students', path: '/admin/students' },
    { name: 'Branches', path: '/admin/branches' },
    { name: 'Materials', path: '/admin/materials' },
    { name: 'Papers', path: '/admin/question-papers' },
    { name: 'Announcements', path: '/admin/announcements' },
    { name: 'Banner', path: '/admin/banner' }
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="fixed w-full top-0 bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg z-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/admin/dashboard" className="flex items-center space-x-3">
            <img
              src="https://abhi-crr.s3.ap-south-1.amazonaws.com/300060993_467370488735241_2637983149385496727_n.jpg"
              alt="CRR Logo"
              className="h-16 w-16 rounded-full object-cover border-2 border-white"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold">Sir C.R. Reddy Admin</h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-3 py-2 rounded-md text-sm font-medium text-blue-100 hover:bg-blue-700 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-blue-200">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              <FiLogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-700"
              >
                {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-blue-800 border-t border-blue-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:bg-blue-700"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
