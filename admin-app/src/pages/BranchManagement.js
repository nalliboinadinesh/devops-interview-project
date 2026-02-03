import React, { useEffect, useState } from 'react';
import { branchAPI } from '../services/api';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

const BranchManagement = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    hod: '',
    regulations: []
  });
  const [regulationInput, setRegulationInput] = useState('');

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await branchAPI.getAll();
      setBranches(response.data);
    } catch (error) {
      toast.error('Failed to fetch branches');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (branch = null) => {
    if (branch) {
      setEditingBranch(branch);
      setFormData({
        code: branch.code || '',
        name: branch.name || '',
        hod: branch.hod || '',
        regulations: branch.regulations || []
      });
    } else {
      setEditingBranch(null);
      setFormData({
        code: '',
        name: '',
        hod: '',
        regulations: []
      });
    }
    setRegulationInput('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBranch(null);
  };

  const handleAddRegulation = () => {
    if (regulationInput.trim() && !formData.regulations.includes(regulationInput.trim())) {
      setFormData({
        ...formData,
        regulations: [...formData.regulations, regulationInput.trim()]
      });
      setRegulationInput('');
    }
  };

  const handleRemoveRegulation = (regulation) => {
    setFormData({
      ...formData,
      regulations: formData.regulations.filter(r => r !== regulation)
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'code' ? value.toUpperCase() : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      toast.error('Code and Name are required');
      return;
    }

    try {
      if (editingBranch) {
        await branchAPI.update(editingBranch._id, formData);
        toast.success('Branch updated successfully');
      } else {
        await branchAPI.create(formData);
        toast.success('Branch created successfully');
      }
      handleCloseModal();
      fetchBranches();
    } catch (error) {
      toast.error(editingBranch ? 'Failed to update branch' : 'Failed to create branch');
      console.error(error);
    }
  };

  const handleDelete = async (branchId) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        await branchAPI.delete(branchId);
        toast.success('Branch deleted successfully');
        fetchBranches();
      } catch (error) {
        toast.error('Failed to delete branch');
        console.error(error);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Branches</h1>
          <p className="text-gray-600 mt-1">Add and manage academic branches</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          <FiPlus size={20} />
          <span>Add Branch</span>
        </button>
      </div>

      {/* Branches Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : branches.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No branches found</h3>
          <p className="text-gray-600 mb-6">Add your first branch to get started.</p>
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Add Branch
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">HOD</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Regulations</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {branches.map((branch) => (
                  <tr key={branch._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{branch.code}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{branch.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{branch.hod || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {branch.regulations && branch.regulations.length > 0 
                        ? branch.regulations.join(', ') 
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(branch)}
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center space-x-1"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(branch._id)}
                        className="text-red-600 hover:text-red-800 inline-flex items-center space-x-1"
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingBranch ? 'Edit Branch' : 'Add Branch'}
              </h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Code */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Code * <span className="text-gray-500 text-xs">(auto-uppercase)</span>
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="CSE, ECE, etc."
                  maxLength="10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Computer Science"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              {/* HOD */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Head of Department
                </label>
                <input
                  type="text"
                  name="hod"
                  value={formData.hod}
                  onChange={handleInputChange}
                  placeholder="Dr. Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              {/* Regulations */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Regulations
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={regulationInput}
                    onChange={(e) => setRegulationInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddRegulation();
                      }
                    }}
                    placeholder="e.g., R22, R23, R24"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddRegulation}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-semibold"
                  >
                    Add
                  </button>
                </div>
                {formData.regulations.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.regulations.map((regulation) => (
                      <div
                        key={regulation}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                      >
                        {regulation}
                        <button
                          type="button"
                          onClick={() => handleRemoveRegulation(regulation)}
                          className="text-blue-600 hover:text-blue-900 font-bold cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                  {editingBranch ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchManagement;
