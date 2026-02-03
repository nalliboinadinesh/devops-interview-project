import React, { useState, useEffect } from 'react';
import { questionPaperAPI, branchAPI } from '../services/api';
import { FiDownload, FiFilter } from 'react-icons/fi';

const QuestionPapers = () => {
  const [papers, setPapers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [branchRegulations, setBranchRegulations] = useState([]);
  const [filters, setFilters] = useState({
    branch: '',
    semester: '',
    academicYear: '',
    regulation: '',
    examType: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0
  });

  const examTypes = ['Mid', 'Final', 'Supplementary'];

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await branchAPI.getAll();
        setBranches(response.data);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    fetchBranches();
    fetchQuestionPapers();
  }, []);

  useEffect(() => {
    fetchQuestionPapers();
  }, [filters, pagination.page]);

  const fetchQuestionPapers = async () => {
    setLoading(true);
    try {
      const response = await questionPaperAPI.getAll(
        filters.branch || undefined,
        filters.semester || undefined,
        filters.academicYear || undefined,
        filters.regulation || undefined,
        filters.examType || undefined,
        pagination.page,
        pagination.limit
      );
      setPapers(response.data.papers);
      setPagination(prev => ({ ...prev, total: response.data.pagination.total }));
    } catch (error) {
      console.error('Error fetching question papers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    // When branch changes, fetch its regulations and reset regulation filter
    if (name === 'branch') {
      const selectedBranch = branches.find(b => b.code === value);
      if (selectedBranch) {
        setBranchRegulations(selectedBranch.regulations || []);
      } else {
        setBranchRegulations([]);
      }
      setFilters(prev => ({ ...prev, [name]: value, regulation: '' }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
    
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Question Papers</h1>
        <p className="text-gray-600 mb-8">Previous year examination papers to help you prepare</p>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <FiFilter size={20} className="text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Branch</label>
              <select
                name="branch"
                value={filters.branch}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">All Branches</option>
                {branches.map((b) => (
                  <option key={b._id} value={b.code}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Semester</label>
              <select
                name="semester"
                value={filters.semester}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">All Semesters</option>
                {[1, 3, 4, 5, 6].map((sem) => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Academic Year</label>
              <input
                type="text"
                name="academicYear"
                value={filters.academicYear}
                onChange={handleFilterChange}
                placeholder="e.g., 2023-2024"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Regulation</label>
              <select
                name="regulation"
                value={filters.regulation}
                onChange={handleFilterChange}
                disabled={!filters.branch}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">All Regulations</option>
                {branchRegulations.map((reg, index) => (
                  <option key={index} value={reg}>{reg}</option>
                ))}
              </select>
              {!filters.branch && (
                <p className="text-xs text-gray-500 mt-1">Select a branch first</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Exam Type</label>
              <select
                name="examType"
                value={filters.examType}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">All Types</option>
                {examTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Papers List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin">
              <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            </div>
          </div>
        ) : papers.length > 0 ? (
          <>
            <div className="grid gap-4 mb-8">
              {papers.map((paper) => (
                <div key={paper._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{paper.title}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                        <span>📚 {paper.subject}</span>
                        <span>📖 Semester {paper.semester}</span>
                        <span>🏢 {paper.branch}</span>
                        <span>📅 {paper.academicYear}</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {paper.examType}
                        </span>
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          Regulation: {paper.regulation}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        📥 {paper.downloadCount} downloads
                      </p>
                    </div>
                    <a
                      href={paper.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors whitespace-nowrap"
                    >
                      <FiDownload size={20} />
                      <span>Download</span>
                    </a>
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
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
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
                {totalPages > 5 && <span className="px-2 py-2">...</span>}
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
            <p className="text-gray-600 text-lg">No question papers found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionPapers;
