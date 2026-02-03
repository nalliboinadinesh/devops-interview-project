import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setStudent, setLoading, setError } from '../redux/studentSlice';
import { studentAPI, branchAPI } from '../services/api';
import { FiSearch } from 'react-icons/fi';

export const StudentSearch = () => {
  const dispatch = useDispatch();
  const [pin, setPin] = useState('');
  const [branch, setBranch] = useState('');
  const [branches, setBranches] = useState([]);
  const [searchError, setSearchError] = useState('');

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
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchError('');

    if (!pin.trim()) {
      setSearchError('Please enter a PIN number');
      return;
    }

    dispatch(setLoading(true));

    try {
      const response = await studentAPI.search(pin, branch || undefined);
      let studentData = response.data;
      
      // Fetch branch regulations and add to student data
      if (studentData && studentData.branch) {
        try {
          const branchResponse = await branchAPI.getByName(studentData.branch);
          if (branchResponse.data) {
            studentData.branchRegulations = branchResponse.data.regulations || [];
          }
        } catch (error) {
          console.error('Error fetching branch regulations:', error);
        }
      }
      
      dispatch(setStudent(studentData));
      dispatch(setError(null));
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Student not found. Please check the PIN.';
      setSearchError(errorMessage);
      dispatch(setError(errorMessage));
      dispatch(setStudent(null));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 -mt-16 relative z-10 mx-4 sm:mx-8 md:mx-16 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Search Student</h2>
      <p className="text-gray-600 mb-6">Enter PIN to view student details</p>

      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PIN Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Student PIN <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter student PIN"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Branch Filter */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Branch (Optional)
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">All Branches</option>
              {branches.map((b) => (
                <option key={b._id} value={b.code}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Message */}
        {searchError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {searchError}
          </div>
        )}

        {/* Search Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-8 rounded-lg transition-colors"
          >
            <FiSearch size={20} />
            <span>Search</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentSearch;
