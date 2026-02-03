import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FiArrowLeft, FiMail, FiPhone, FiMapPin, FiCalendar, FiBook } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export const StudentDetails = ({ onViewDetails }) => {
  const navigate = useNavigate();
  const student = useSelector((state) => state.student.student);
  const [activeTab, setActiveTab] = useState('personal');

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No student data found. Please search for a student first.</p>
      </div>
    );
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <FiArrowLeft size={20} />
          <span>Back to Search</span>
        </button>

        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Profile Picture (30% width on desktop) */}
            <div className="md:col-span-1 flex justify-center">
              <div className="w-40 h-40 rounded-lg overflow-hidden bg-gray-200 border-4 border-blue-600 flex items-center justify-center">
                {student.personalInfo?.profilePictureUrl ? (
                  <img
                    src={student.personalInfo.profilePictureUrl}
                    alt={`${student.personalInfo.firstName} ${student.personalInfo.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                    {student.personalInfo?.firstName?.charAt(0)}{student.personalInfo?.lastName?.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Personal Information (70% width on desktop) */}
            <div className="md:col-span-3 space-y-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {student.personalInfo?.firstName} {student.personalInfo?.lastName}
                </h2>
                <p className="text-lg text-gray-600 mt-1">PIN: <strong>{student.pin}</strong></p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 text-gray-700">
                  <FiBook size={20} className="text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Branch</p>
                    <p className="font-semibold">{student.branch}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-gray-700">
                  <FiCalendar size={20} className="text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Academic Year</p>
                    <p className="font-semibold">{student.academicYear}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-gray-700">
                  <FiMail size={20} className="text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-sm">{student.personalInfo?.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-gray-700">
                  <FiPhone size={20} className="text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-semibold">{student.personalInfo?.phone}</p>
                  </div>
                </div>
              </div>

              {student.personalInfo?.address && (
                <div className="flex items-start space-x-3 text-gray-700">
                  <FiMapPin size={20} className="text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-semibold text-sm">
                      {student.personalInfo.address.street}, {student.personalInfo.address.city},
                      {student.personalInfo.address.state} {student.personalInfo.address.postalCode}
                    </p>
                  </div>
                </div>
              )}

              {student.academicInfo?.cgpa && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">CGPA</p>
                      <p className="text-2xl font-bold text-blue-600">{student.academicInfo.cgpa.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Current Semester</p>
                      <p className="text-2xl font-bold text-blue-600">Sem {student.academicInfo.currentSemester}</p>
                    </div>
                    <button
                      onClick={onViewDetails}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition"
                    >
                      View Full Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="flex border-b">
            {['personal', 'attendance', 'marks'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-4 font-semibold transition-colors text-center ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Personal Tab */}
            {activeTab === 'personal' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
                    <p className="text-gray-900">{formatDate(student.personalInfo?.dateOfBirth)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
                    <p className="text-gray-900">{student.personalInfo?.gender}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Regulation</label>
                    <p className="text-gray-900">{student.academicInfo?.regulation || 'N/A'}</p>
                  </div>
                </div>
                
                {/* Branch Regulations Section */}
                {student.branchRegulations && student.branchRegulations.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Branch Regulations</label>
                    <div className="flex flex-wrap gap-2">
                      {student.branchRegulations.map((reg, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {reg}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Attendance Tab */}
            {activeTab === 'attendance' && (
              <div className="space-y-4">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-lg font-semibold text-gray-900">Overall Attendance</label>
                    <span className="text-3xl font-bold text-blue-600">
                      {student.attendance?.overallAttendance || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all"
                      style={{ width: `${student.attendance?.overallAttendance || 0}%` }}
                    ></div>
                  </div>
                </div>

                {student.attendance?.semesterAttendance && student.attendance.semesterAttendance.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left font-semibold text-gray-900">Semester</th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-900">Percentage</th>
                          <th className="px-4 py-2 text-left font-semibold text-gray-900">Attended/Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {student.attendance.semesterAttendance.map((sem, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-semibold">Semester {sem.semester}</td>
                            <td className="px-4 py-3">
                              <span className={`font-semibold ${sem.percentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                                {sem.percentage}%
                              </span>
                            </td>
                            <td className="px-4 py-3">{sem.classes?.attended}/{sem.classes?.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-600">No attendance data available</p>
                )}
              </div>
            )}

            {/* Marks Tab */}
            {activeTab === 'marks' && (
              <div className="space-y-6">
                {student.academicInfo?.semesterMarks && student.academicInfo.semesterMarks.length > 0 ? (
                  student.academicInfo.semesterMarks.map((sem, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-bold text-lg text-gray-900 mb-4">Semester {sem.semester}</h4>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-700">GPA</span>
                        <span className="text-2xl font-bold text-blue-600">{sem.gpa?.toFixed(2)}</span>
                      </div>
                      {sem.marks && sem.marks.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-3 py-2 text-left font-semibold">Subject</th>
                                <th className="px-3 py-2 text-left font-semibold">Marks</th>
                                <th className="px-3 py-2 text-left font-semibold">Grade</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {sem.marks.map((mark, idx) => (
                                <tr key={idx}>
                                  <td className="px-3 py-2">{mark.subject}</td>
                                  <td className="px-3 py-2">{mark.marks}</td>
                                  <td className="px-3 py-2 font-semibold">{mark.grade}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-gray-600">No marks data available</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No marks data available</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
