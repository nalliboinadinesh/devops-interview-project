import React, { useState, useEffect } from 'react';
import { studentAPI, branchAPI } from '../services/api';
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';
import StudentModal from '../components/StudentModal';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    fetchBranches();
    fetchStudents();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await branchAPI.getAll();
      setBranches(response.data || []);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await studentAPI.getAll('', '', 1, 100);
      setStudents(response.data.students || []);
    } catch (error) {
      toast.error('Failed to fetch students');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (student = null) => {
    setEditingStudent(student);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingStudent(null);
  };

  const handleSubmitModal = async (formDataObj) => {
    try {
      console.log('Submitting student data:', formDataObj);
      
      // Create FormData for multipart submission
      const submitData = new FormData();
      
      // Add all form fields
      submitData.append('pin', formDataObj.pin);
      submitData.append('branch', formDataObj.branch);
      submitData.append('academicYear', formDataObj.academicYear);
      
      // Send nested objects as JSON strings
      submitData.append('personalInfo', JSON.stringify(formDataObj.personalInfo));
      submitData.append('academicInfo', JSON.stringify(formDataObj.academicInfo));
      submitData.append('attendance', JSON.stringify(formDataObj.attendance));
      
      // Add profile picture file if present
      if (formDataObj.profilePictureFile) {
        submitData.append('profilePicture', formDataObj.profilePictureFile);
      }
      
      if (editingStudent) {
        // Update existing student
        await studentAPI.update(editingStudent._id || editingStudent.id, submitData);
        toast.success('Student updated successfully');
      } else {
        // Create new student
        await studentAPI.create(submitData);
        toast.success('Student created successfully');
      }
      handleCloseModal();
      fetchStudents();
    } catch (error) {
      console.error('Error saving student:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      toast.error(error.response?.data?.message || 'Failed to save student');
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentAPI.delete(studentId);
        toast.success('Student deleted successfully');
        fetchStudents();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete student');
      }
    }
  };

  const filteredStudents = students.filter(student => {
    const pin = (student.pin || '').toLowerCase();
    const name = `${student.firstName || ''} ${student.lastName || ''}`.toLowerCase();
    const term = searchTerm.toLowerCase();
    return pin.includes(term) || name.includes(term);
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Students</h1>
          <p className="text-gray-600 mt-1">Manage student information and academics</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          <FiPlus size={20} />
          <span>Add Student</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search PIN or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No students found</h3>
          <p className="text-gray-600 mb-6">Add your first student to get started.</p>
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Add Student
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">PIN</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Branch</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Year</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.pin}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.branch}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.academicYear}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.email}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(student)}
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                        title="Edit"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(student._id)}
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

      <StudentModal 
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmitModal}
        student={editingStudent}
        branches={branches}
      />
    </div>
  );
};

export default StudentManagement;
