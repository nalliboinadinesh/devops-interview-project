import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FiX } from 'react-icons/fi';
import { MdPerson, MdEmail, MdLocationOn, MdDateRange, MdSchool } from 'react-icons/md';

const StudentInfo = ({ onClose }) => {
  const student = useSelector(state => state.student.student);
  const [activeTab, setActiveTab] = useState('attendance');

  if (!student) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Student Information</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FiX size={24} />
            </button>
          </div>
          <p className="text-center text-gray-500 py-8">No student data available. Please search for a student first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-5xl my-8">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Student Information</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={28} />
          </button>
        </div>

        {/* Main Content */}
        <div className="p-6 overflow-y-auto max-h-[85vh]">
          {/* Personal Information Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Profile Card - 30% width */}
              <div className="lg:w-1/3">
                <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg p-6 text-white text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-32 h-32 bg-blue-800 rounded-full flex items-center justify-center">
                      <MdPerson size={64} className="text-blue-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{student.personalInfo?.name || 'N/A'}</h3>
                  <p className="text-blue-200 mb-4">PIN: {student.pin || 'N/A'}</p>
                  <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded transition">
                    Download Certificate
                  </button>
                </div>
              </div>

              {/* Personal Details - 70% width */}
              <div className="lg:w-2/3">
                <h3 className="text-lg font-bold text-blue-600 mb-4 flex items-center gap-2">
                  <MdPerson /> Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="flex items-start gap-3">
                    <MdPerson className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-semibold text-gray-800">{student.personalInfo?.name || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="flex items-start gap-3">
                    <MdPerson className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="font-semibold text-gray-800">{student.personalInfo?.gender || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <MdEmail className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-semibold text-gray-800 break-all">{student.personalInfo?.email || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <MdPerson className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-semibold text-gray-800">{student.personalInfo?.phone || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-3 md:col-span-2">
                    <MdLocationOn className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-semibold text-gray-800">{student.personalInfo?.address || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Academic Year */}
                  <div className="flex items-start gap-3">
                    <MdDateRange className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Academic Year</p>
                      <p className="font-semibold text-gray-800">{student.academicYear || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Branch */}
                  <div className="flex items-start gap-3">
                    <MdSchool className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Branch</p>
                      <p className="font-semibold text-gray-800">{student.branch || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Current Semester */}
                  <div className="flex items-start gap-3">
                    <MdSchool className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Current Semester</p>
                      <p className="font-semibold text-gray-800">{student.academicInfo?.currentSemester || 'N/A'}</p>
                    </div>
                  </div>

                  {/* CGPA */}
                  <div className="flex items-start gap-3">
                    <MdSchool className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">CGPA</p>
                      <p className="font-semibold text-gray-800">{student.academicInfo?.CGPA || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('attendance')}
                className={`py-3 px-4 font-semibold border-b-2 transition ${
                  activeTab === 'attendance'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 border-transparent hover:text-blue-600'
                }`}
              >
                Semester-wise Attendance
              </button>
              <button
                onClick={() => setActiveTab('marks')}
                className={`py-3 px-4 font-semibold border-b-2 transition ${
                  activeTab === 'marks'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-600 border-transparent hover:text-blue-600'
                }`}
              >
                Semester-wise Marks
              </button>
            </div>
          </div>

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-bold text-blue-600 mb-6">Semester-wise Attendance</h3>
              
              {/* Semesters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {[1, 3, 4, 5, 6].map((sem) => (
                  <div key={sem} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800">Semester {sem}</h4>
                      <span className="text-2xl font-bold text-green-600">
                        {student.attendance?.semesterwise?.[`semester${sem}`] || '0'}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${student.attendance?.semesterwise?.[`semester${sem}`] || 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Overall Attendance */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-800">Overall Attendance</h4>
                  <span className="text-4xl font-bold text-green-600">{student.attendance?.overall || '0'}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{ width: `${student.attendance?.overall || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Marks Tab */}
          {activeTab === 'marks' && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-bold text-blue-600 mb-6">Semester-wise Marks</h3>

              {[1, 3, 4, 5, 6].map((sem) => (
                <div key={sem} className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-gray-800 text-lg">Semester {sem}</h4>
                    <span className="text-sm font-semibold text-blue-600">
                      GPA: {student.academicInfo?.semesterMarks?.[`semester${sem}`]?.gpa || '0.0'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { subject: 'Mathematics', marks: Math.floor(Math.random() * 40 + 60) },
                      { subject: 'Physics', marks: Math.floor(Math.random() * 40 + 60) },
                      { subject: 'Chemistry', marks: Math.floor(Math.random() * 40 + 60) },
                      { subject: 'Programming', marks: Math.floor(Math.random() * 40 + 60) },
                      { subject: 'Database', marks: Math.floor(Math.random() * 40 + 60) },
                      { subject: 'Web Development', marks: Math.floor(Math.random() * 40 + 60) },
                    ].map((subject, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-1">{subject.subject}</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-blue-600">{subject.marks}</span>
                            <span className="text-sm text-gray-500">/ 100</span>
                          </div>
                        </div>
                        <div className="text-xl font-bold text-gray-400">A</div>
                      </div>
                    ))}
                  </div>

                  {sem < 8 && <hr className="my-6" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentInfo;
