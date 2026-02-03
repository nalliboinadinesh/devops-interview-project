import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { studentAPI, branchAPI, carouselAPI, announcementAPI } from '../services/api';
import { FiUsers, FiBook, FiFileText, FiBell, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchPin, setSearchPin] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalBranches: 0,
    totalMaterials: 0,
    totalPapers: 0,
    recentAnnouncements: [],
    branches: []
  });

  useEffect(() => {
    fetchDashboardData();
    fetchAnnouncements();
    // Optionally, set up polling or websockets for real-time updates
    // const interval = setInterval(fetchAnnouncements, 10000);
    // return () => clearInterval(interval);
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await announcementAPI.getAll('', 1, 5); // Fetch latest 5 announcements
      setStats((prev) => ({ ...prev, recentAnnouncements: res.data.announcements || [] }));
    } catch (error) {
      toast.error('Failed to fetch announcements');
      console.error(error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [students, branches] = await Promise.all([
        studentAPI.getAll('', '', 1, 100),
        branchAPI.getAll()
      ]);

      setStats((prev) => ({
        ...prev,
        totalStudents: students.data.pagination?.total || 0,
        totalBranches: branches.data.length || 0,
        totalMaterials: 45,
        totalPapers: 32,
        branches: branches.data
      }));
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchPin.trim()) {
      toast.warning('Please enter a student PIN');
      return;
    }

    try {
      const response = await studentAPI.getAll(searchPin, '', 1, 1);
      if (response.data.students && response.data.students.length > 0) {
        setSearchResult(response.data.students[0]);
      } else {
        setSearchResult(null);
        toast.info('Student not found');
      }
    } catch (error) {
      toast.error('Failed to search student');
      console.error(error);
    }
  };

  const statCards = [
    {
      icon: FiUsers,
      label: 'Total Students',
      value: stats.totalStudents,
      color: 'bg-blue-50 text-blue-600',
      action: () => navigate('/admin/students')
    },
    {
      icon: FiBook,
      label: 'Total Branches',
      value: stats.totalBranches,
      color: 'bg-purple-50 text-purple-600',
      action: () => navigate('/admin/branches')
    },
    {
      icon: FiFileText,
      label: 'Study Materials',
      value: stats.totalMaterials,
      color: 'bg-green-50 text-green-600',
      action: () => navigate('/admin/materials')
    },
    {
      icon: FiBell,
      label: 'Question Papers',
      value: stats.totalPapers,
      color: 'bg-orange-50 text-orange-600',
      action: () => navigate('/admin/question-papers')
    }
  ];

  const quickActions = [
    {
      icon: FiUsers,
      title: 'Add Student',
      action: () => navigate('/admin/students?action=add'),
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      icon: FiFileText,
      title: 'Upload Material',
      action: () => navigate('/admin/materials?action=add'),
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      icon: FiFileText,
      title: 'Add Question Paper',
      action: () => navigate('/admin/question-papers?action=add'),
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      icon: FiBell,
      title: 'New Announcement',
      action: () => navigate('/admin/announcements?action=add'),
      color: 'bg-orange-600 hover:bg-orange-700'
    },
    {
      icon: FiBook,
      title: 'Manage Banner',
      action: () => navigate('/admin/banner'),
      color: 'bg-pink-600 hover:bg-pink-700'
    },
    {
      icon: FiBook,
      title: 'Manage Branches',
      action: () => navigate('/admin/branches'),
      color: 'bg-indigo-600 hover:bg-indigo-700'
    }
  ];

  const getPriorityBadgeColor = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Medium':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-6">
          <img src="https://abhi-crr.s3.ap-south-1.amazonaws.com/300060993_467370488735241_2637983149385496727_n.jpg" alt="CRR Logo" className="h-20 w-20 rounded-full object-cover border-4 border-blue-600 shadow-lg" />
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back! Manage your college system here.</p>
          </div>
        </div>

        {/* Global Student Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Student by PIN</label>
              <input
                type="text"
                value={searchPin}
                onChange={(e) => setSearchPin(e.target.value)}
                placeholder="Enter student PIN"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                <FiSearch size={20} />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Search Result */}
          {searchResult && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">Student Found:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-green-700 font-medium">PIN</p>
                  <p className="text-green-900">{searchResult.pin}</p>
                </div>
                <div>
                  <p className="text-green-700 font-medium">Name</p>
                  <p className="text-green-900">{searchResult.personalInfo?.firstName} {searchResult.personalInfo?.lastName}</p>
                </div>
                <div>
                  <p className="text-green-700 font-medium">Branch</p>
                  <p className="text-green-900">{searchResult.branch}</p>
                </div>
                <div>
                  <p className="text-green-700 font-medium">Year</p>
                  <p className="text-green-900">{searchResult.academicYear}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <button
                key={index}
                onClick={stat.action}
                className={`${stat.color} rounded-lg shadow hover:shadow-lg transition-all p-6 text-left cursor-pointer transform hover:scale-105`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                    <p className="text-4xl font-bold">{stat.value}</p>
                  </div>
                  <Icon size={40} className="opacity-20" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={action.action}
                      className={`w-full flex items-center space-x-3 ${action.color} text-white px-4 py-3 rounded-lg transition-colors`}
                    >
                      <Icon size={20} />
                      <span className="font-medium text-sm">{action.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Announcements */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Announcements</h2>
              <div className="space-y-3">
                {stats.recentAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{announcement.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">{announcement.type}</span>
                        <span className={`text-xs px-2 py-1 rounded border ${getPriorityBadgeColor(announcement.priority)}`}>
                          {announcement.priority}
                        </span>
                        <span className="text-xs text-gray-500">{announcement.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
