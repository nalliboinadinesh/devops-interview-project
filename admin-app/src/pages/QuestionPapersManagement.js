import React, { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { questionPaperAPI, branchAPI } from '../services/api';

const QuestionPapersManagement = () => {
  const [papers, setPapers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPaper, setEditingPaper] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [branchRegulations, setBranchRegulations] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    branch: '',
    semester: '',
    subject: '',
    examType: 'Mid',
    academicYear: new Date().getFullYear(),
    regulation: '',
    fileUrl: '',
    file: null
  });

  useEffect(() => {
    fetchBranches();
    fetchPapers();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await branchAPI.getAll();
      setBranches(response.data.branches || response.data || []);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const fetchPapers = async () => {
    try {
      setLoading(true);
      const response = await questionPaperAPI.getAll();
      setPapers(response.data.papers || response.data || []);
    } catch (error) {
      toast.error('Failed to fetch question papers');
      console.error('Error fetching papers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (paper = null) => {
    if (paper) {
      setEditingPaper(paper);
      setFormData(paper);
      // When editing, fetch regulations for the paper's branch
      const selectedBranch = branches.find(b => b.code === paper.branch);
      if (selectedBranch) {
        setBranchRegulations(selectedBranch.regulations || []);
      }
    } else {
      setEditingPaper(null);
      setBranchRegulations([]);
      setFormData({
        title: '',
        branch: '',
        semester: '',
        subject: '',
        examType: 'Mid',
        academicYear: new Date().getFullYear(),
        regulation: '',
        fileUrl: '',
        file: null
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPaper(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // When branch changes, update regulations and reset regulation field
    if (name === 'branch') {
      const selectedBranch = branches.find(b => b.code === value);
      if (selectedBranch) {
        setBranchRegulations(selectedBranch.regulations || []);
      } else {
        setBranchRegulations([]);
      }
      setFormData({ ...formData, [name]: value, regulation: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFormData({ ...formData, file: file, fileUrl: file.name });
      toast.success('PDF selected');
    } else {
      toast.error('Please upload a PDF file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.branch || !formData.semester || !formData.subject || !formData.regulation) {
      toast.error('Title, Branch, Semester, Subject, and Regulation are required');
      return;
    }

    if (!formData.file && !editingPaper) {
      toast.error('File is required for new question papers');
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('branch', formData.branch);
      submitData.append('semester', formData.semester);
      submitData.append('subject', formData.subject);
      submitData.append('examType', formData.examType);
      submitData.append('academicYear', formData.academicYear);
      submitData.append('regulation', formData.regulation);
      
      if (formData.file) {
        submitData.append('file', formData.file);
      }

      if (editingPaper) {
        await questionPaperAPI.update(editingPaper._id, submitData);
        toast.success('Question paper updated successfully');
      } else {
        await questionPaperAPI.create(submitData);
        toast.success('Question paper created successfully');
      }
      handleCloseModal();
      fetchPapers();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to save question paper';
      toast.error(errorMsg);
      console.error('Question paper submission error:', error);
    }
  };

  const handleDelete = async (paperId) => {
    if (window.confirm('Are you sure you want to delete this question paper?')) {
      try {
        await questionPaperAPI.delete(paperId);
        toast.success('Question paper deleted successfully');
        fetchPapers();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete question paper');
      }
    }
  };

  const filteredPapers = papers.filter(paper =>
    paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paper.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Question Papers</h1>
          <p className="text-gray-600 mt-1">Upload and manage exam question papers</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          <FiPlus size={20} />
          <span>Add Question Paper</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search question papers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Papers Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredPapers.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No question papers found</h3>
          <p className="text-gray-600 mb-6">Upload your first question paper to get started.</p>
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Add Question Paper
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Branch</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Sem</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Year</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Regulation</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredPapers.map((paper) => (
                  <tr key={paper._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{paper.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{paper.branch}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{paper.semester}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        paper.examType === 'Mid' ? 'bg-yellow-100 text-yellow-800' :
                        paper.examType === 'Final' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {paper.examType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{paper.academicYear}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{paper.regulation}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(paper)}
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                        title="Edit"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(paper._id)}
                        className="text-red-600 hover:text-red-800 inline-flex items-center"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingPaper ? 'Edit Question Paper' : 'Add Question Paper'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Data Structures Mid Exam"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              {/* Branch & Semester */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Branch *</label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  >
                    <option value="">Select Branch</option>
                    {branches.map((branch) => (
                      <option key={branch._id} value={branch.name}>{branch.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Semester</label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6].map(sem => (
                      <option key={sem} value={sem}>{sem}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="e.g., Data Structures"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Exam Type & Year */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Exam Type</label>
                  <select
                    name="examType"
                    value={formData.examType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Mid">Mid</option>
                    <option value="Final">Final</option>
                    <option value="Supplementary">Supplementary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Academic Year</label>
                  <select
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {[2024, 2023, 2022, 2021].map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Regulation */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Regulation *</label>
                <select
                  name="regulation"
                  value={formData.regulation}
                  onChange={handleInputChange}
                  disabled={!formData.branch || branchRegulations.length === 0}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select Regulation</option>
                  {branchRegulations.map((reg, index) => (
                    <option key={index} value={reg}>{reg}</option>
                  ))}
                </select>
                {!formData.branch && (
                  <p className="text-xs text-gray-500 mt-1">Select a branch first</p>
                )}
                {formData.branch && branchRegulations.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">No regulations defined for this branch</p>
                )}
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Upload PDF *</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    name="file"
                    onChange={handleFileUpload}
                    accept=".pdf"
                    className="hidden"
                    id="pdfInput"
                  />
                  <label htmlFor="pdfInput" className="cursor-pointer">
                    {formData.fileUrl ? (
                      <div>
                        <p className="text-green-600 font-medium">✓ {formData.fileUrl}</p>
                        <p className="text-xs text-gray-500 mt-1">Click to replace</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-600">📤 Upload PDF File</p>
                        <p className="text-xs text-gray-500">PDF only</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-semibold"
                >
                  {editingPaper ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionPapersManagement;
