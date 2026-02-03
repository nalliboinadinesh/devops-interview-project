import React, { useState, useEffect } from 'react';
import { announcementAPI } from '../services/api';
import { FiClock, FiAlertCircle } from 'react-icons/fi';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  const types = ['General', 'Academic', 'Exam', 'Event', 'Holiday'];

  useEffect(() => {
    fetchAnnouncements();
  }, [selectedType, pagination.page]);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await announcementAPI.getAll(
        selectedType || undefined,
        pagination.page,
        pagination.limit
      );
      setAnnouncements(response.data.announcements);
      setPagination(prev => ({ ...prev, total: response.data.pagination.total }));
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-800 border-red-300';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Exam': return '📝';
      case 'Holiday': return '🎉';
      case 'Event': return '🎪';
      case 'Academic': return '📚';
      default: return '📢';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Announcements</h1>
        <p className="text-gray-600 mb-8">Stay updated with latest college news and announcements</p>

        {/* Type Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => {
              setSelectedType('');
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className={`px-4 py-2 rounded-full font-semibold transition-colors ${
              selectedType === ''
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-600'
            }`}
          >
            All
          </button>
          {types.map((type) => (
            <button
              key={type}
              onClick={() => {
                setSelectedType(type);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className={`px-4 py-2 rounded-full font-semibold transition-colors ${
                selectedType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:border-blue-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Announcements List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin">
              <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          </div>
        ) : announcements.length > 0 ? (
          <>
            <div className="space-y-4 mb-8">
              {announcements.map((announcement) => (
                <div
                  key={announcement._id}
                  className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border-l-4 ${
                    announcement.priority === 'Urgent'
                      ? 'border-red-500'
                      : announcement.priority === 'High'
                      ? 'border-orange-500'
                      : announcement.priority === 'Medium'
                      ? 'border-yellow-500'
                      : 'border-green-500'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getTypeIcon(announcement.type)}</span>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{announcement.title}</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className={`text-xs font-semibold px-2 py-1 rounded border ${getPriorityColor(announcement.priority)}`}>
                            {announcement.priority}
                          </span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {announcement.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <FiClock size={16} />
                        <span>{formatDate(announcement.publishDate)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {announcement.attachments && announcement.attachments.length > 0 && announcement.attachments[0].url && (
                    <div className="mb-3">
                      <img
                        src={announcement.attachments[0].url}
                        alt="Announcement Preview"
                        className="max-h-64 rounded-lg border border-gray-200 shadow mb-2"
                        style={{ objectFit: 'cover', width: '100%' }}
                      />
                    </div>
                  )}
                  <p className="text-gray-700 mb-3 line-clamp-3">{announcement.content}</p>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    {/* Views removed as requested */}
                    {announcement.attachments && announcement.attachments.length > 0 && (
                      <span>📎 {announcement.attachments.length} attachment{announcement.attachments.length > 1 ? 's' : ''}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setPagination(prev => ({ ...prev, page }))}
                    className={`px-4 py-2 rounded-lg ${
                      pagination.page === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.min(totalPages, prev.page + 1) }))}
                  disabled={pagination.page === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FiAlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600 text-lg">No announcements available at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
