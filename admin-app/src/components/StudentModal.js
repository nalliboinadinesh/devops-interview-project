import React, { useState, useEffect } from 'react';
import { FiX, FiUpload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './StudentModal.css';

const StudentModal = ({ isOpen, onClose, onSubmit, student = null, branches = [] }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [availableRegulations, setAvailableRegulations] = useState([]);
  
  const [formData, setFormData] = useState({
    // Personal Info
    pin: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    profilePictureUrl: '',
    profilePictureFile: null,
    branch: '',
    academicYear: '',
    
    // Academic Info
    regulation: '',
    currentSemester: '',
    cgpa: '',
    semesterMarks: [{ semester: 1, gpa: 0, marks: [] }],
    
    // Attendance
    overallAttendance: '',
    semesterAttendance: [{ semester: 1, percentage: 0, classes: { attended: 0, total: 0 } }]
  });

  const [semesterSubjects, setSemesterSubjects] = useState({
    1: [{ subject: '', marks: '', grade: '' }]
  });

  // Update regulations when branch changes
  useEffect(() => {
    if (formData.branch) {
      const selectedBranch = branches.find(b => b.code === formData.branch);
      if (selectedBranch && selectedBranch.regulations && Array.isArray(selectedBranch.regulations)) {
        // Only show regulations for the selected branch
        setAvailableRegulations(selectedBranch.regulations);
      } else {
        // If no regulations found for branch, show empty
        setAvailableRegulations([]);
      }
    } else {
      // Clear regulations if no branch selected
      setAvailableRegulations([]);
    }
  }, [formData.branch, branches]);

  useEffect(() => {
    if (student && isOpen) {
      setFormData({
        pin: student.pin || '',
        firstName: student.personalInfo?.firstName || '',
        lastName: student.personalInfo?.lastName || '',
        dateOfBirth: student.personalInfo?.dateOfBirth?.split('T')[0] || '',
        gender: student.personalInfo?.gender || '',
        email: student.personalInfo?.email || '',
        phone: student.personalInfo?.phone || '',
        address: student.personalInfo?.address?.street || '',
        city: student.personalInfo?.address?.city || '',
        state: student.personalInfo?.address?.state || '',
        pincode: student.personalInfo?.address?.postalCode || '',
        profilePictureUrl: student.personalInfo?.profilePictureUrl || '',
        profilePictureFile: null,
        branch: student.branch || '',
        academicYear: student.academicYear || '',
        regulation: student.academicInfo?.regulation || '',
        currentSemester: student.academicInfo?.currentSemester || '',
        cgpa: student.academicInfo?.cgpa || '',
        semesterMarks: student.academicInfo?.semesterMarks || [{ semester: 1, gpa: 0, marks: [] }],
        overallAttendance: student.attendance?.overallAttendance || '',
        semesterAttendance: student.attendance?.semesterAttendance || [{ semester: 1, percentage: 0, classes: { attended: 0, total: 0 } }]
      });
    } else if (isOpen) {
      // Reset form for new student
      setFormData({
        pin: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        profilePictureUrl: '',
        profilePictureFile: null,
        branch: '',
        academicYear: '',
        regulation: '',
        currentSemester: '',
        cgpa: '',
        semesterMarks: [{ semester: 1, gpa: 0, marks: [] }],
        overallAttendance: '',
        semesterAttendance: [{ semester: 1, percentage: 0, classes: { attended: 0, total: 0 } }]
      });
    }
  }, [student, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubjectChange = (semester, index, field, value) => {
    setSemesterSubjects(prev => {
      const updated = { ...prev };
      if (!updated[semester]) updated[semester] = [];
      updated[semester][index] = {
        ...updated[semester][index],
        [field]: value
      };
      return updated;
    });
  };

  const addSubject = (semester) => {
    setSemesterSubjects(prev => ({
      ...prev,
      [semester]: [...(prev[semester] || []), { subject: '', marks: '', grade: '' }]
    }));
  };

  const removeSubject = (semester, index) => {
    setSemesterSubjects(prev => ({
      ...prev,
      [semester]: prev[semester].filter((_, i) => i !== index)
    }));
  };

  const handleAttendanceChange = (semester, field, value) => {
    const updated = formData.semesterAttendance.map(att => 
      att.semester === semester ? { ...att, [field]: value } : att
    );
    setFormData(prev => ({ ...prev, semesterAttendance: updated }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }
    // Show preview
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFormData(prev => ({
        ...prev,
        profilePictureFile: file,
        profilePictureUrl: ev.target.result
      }));
    };
    reader.readAsDataURL(file);
    toast.success('Photo selected');
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.pin || !formData.firstName || !formData.lastName || !formData.email || !formData.branch 
        || !formData.gender || !formData.dateOfBirth || !formData.phone || !formData.academicYear) {
      toast.error('Please fill all required fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email');
      return;
    }

    // Validate phone format
    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error('Phone number must be 10 digits');
      return;
    }

    // Validate CGPA range
    const cgpa = parseFloat(formData.cgpa);
    if (cgpa < 0 || cgpa > 10) {
      toast.error('CGPA must be between 0 and 10');
      return;
    }

    // Validate branch enum (from backend)
    const validBranchCodes = branches.map(b => b.code);
    if (!validBranchCodes.includes(formData.branch)) {
      toast.error(`Invalid branch. Must be one of: ${validBranchCodes.join(', ')}`);
      return;
    }

    // Validate gender enum
    const validGenders = ['Male', 'Female', 'Other'];
    if (!validGenders.includes(formData.gender)) {
      toast.error('Invalid gender. Must be: Male, Female, or Other');
      return;
    }

    // Prepare FormData for file upload
    const form = new FormData();
    form.append('pin', formData.pin);
    form.append('branch', formData.branch);
    form.append('academicYear', formData.academicYear);
    // Always send valid JSON strings for these fields
    const personalInfo = {
      firstName: formData.firstName || '',
      lastName: formData.lastName || '',
      dateOfBirth: formData.dateOfBirth || '',
      gender: formData.gender || '',
      email: formData.email || '',
      phone: formData.phone || '',
      address: {
        street: formData.address || '',
        city: formData.city || '',
        state: formData.state || '',
        postalCode: formData.pincode || ''
      }
    };
    const academicInfo = {
      regulation: formData.regulation || '',
      currentSemester: parseInt(formData.currentSemester) || 1,
      cgpa: parseFloat(formData.cgpa) || 0,
      semesterMarks: (formData.semesterMarks || []).map(sem => ({
        semester: sem.semester,
        gpa: sem.gpa,
        marks: semesterSubjects[sem.semester] || []
      }))
    };
    const attendance = {
      overallAttendance: parseFloat(formData.overallAttendance) || 0,
      semesterAttendance: formData.semesterAttendance || []
    };
    form.append('personalInfo', JSON.stringify(personalInfo));
    form.append('academicInfo', JSON.stringify(academicInfo));
    form.append('attendance', JSON.stringify(attendance));
    if (formData.profilePictureFile) {
      form.append('profilePictureFile', formData.profilePictureFile);
    }
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Student</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          <button
            className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            Personal Info
          </button>
          <button
            className={`tab ${activeTab === 'academic' ? 'active' : ''}`}
            onClick={() => setActiveTab('academic')}
          >
            Academic Info
          </button>
          <button
            className={`tab ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance
          </button>
        </div>

        <div className="modal-body">
          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div className="tab-content">
              <h3>Personal Information</h3>
              
              {/* Photo upload removed as requested */}

              <div className="form-grid">
                <div className="form-group">
                  <label>PIN *</label>
                  <input
                    type="text"
                    name="pin"
                    value={formData.pin}
                    onChange={handleInputChange}
                    placeholder="22EC045"
                    disabled={student}
                  />
                </div>
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Priya"
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Patel"
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Branch *</label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Branch</option>
                    {branches.map(b => (
                      <option key={b._id} value={b.code}>{b.code} - {b.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Academic Year</label>
                  <input
                    type="text"
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={handleInputChange}
                    placeholder="2022-2025"
                  />
                </div>
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="priya.patel@student.edu"
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="9876543211"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="456 Park Road"
                  rows="3"
                ></textarea>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Bangalore"
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Karnataka"
                  />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="560001"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Academic Info Tab */}
          {activeTab === 'academic' && (
            <div className="tab-content">
              <h3>Academic Information</h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Regulation</label>
                  <select
                    name="regulation"
                    value={formData.regulation}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Regulation</option>
                    {availableRegulations.map(reg => (
                      <option key={reg} value={reg}>{reg}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Current Semester</label>
                  <select
                    name="currentSemester"
                    value={formData.currentSemester}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Semester</option>
                    {[1, 2, 3, 4, 5, 6].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>CGPA</label>
                  <input
                    type="number"
                    name="cgpa"
                    value={formData.cgpa}
                    onChange={handleInputChange}
                    placeholder="9.1"
                    min="0"
                    max="10"
                    step="0.1"
                  />
                </div>
              </div>

              <h4>Semester-wise Marks</h4>
              {[1, 2, 3, 4, 5, 6].map(semester => (
                <div key={semester} className="semester-marks">
                  <div className="semester-header">
                    <h5>Semester {semester}</h5>
                    <div className="form-group">
                      <label>SGPA</label>
                      <input
                        type="number"
                        value={formData.semesterMarks[semester - 1]?.gpa || 0}
                        onChange={(e) => {
                          const updated = [...formData.semesterMarks];
                          updated[semester - 1] = { ...updated[semester - 1], gpa: parseFloat(e.target.value) };
                          setFormData(prev => ({ ...prev, semesterMarks: updated }));
                        }}
                        min="0"
                        max="10"
                        step="0.1"
                      />
                    </div>
                  </div>

                  {(semesterSubjects[semester] || []).map((subject, index) => (
                    <div key={index} className="subject-row">
                      <input
                        type="text"
                        placeholder="Subject Name"
                        value={subject.subject}
                        onChange={(e) => handleSubjectChange(semester, index, 'subject', e.target.value)}
                      />
                      <input
                        type="number"
                        placeholder="Marks"
                        value={subject.marks}
                        onChange={(e) => handleSubjectChange(semester, index, 'marks', e.target.value)}
                        min="0"
                        max="100"
                      />
                      <input
                        type="text"
                        placeholder="Grade"
                        value={subject.grade}
                        onChange={(e) => handleSubjectChange(semester, index, 'grade', e.target.value)}
                      />
                      <button
                        className="delete-btn"
                        onClick={() => removeSubject(semester, index)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}

                  <button
                    className="add-subject-btn"
                    onClick={() => addSubject(semester)}
                  >
                    + Add Subject
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <div className="tab-content">
              <h3>Attendance Information</h3>
              
              <div className="form-group">
                <label>Overall Attendance (%)</label>
                <input
                  type="number"
                  name="overallAttendance"
                  value={formData.overallAttendance}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  placeholder="92"
                />
              </div>

              <h4>Semester-wise Attendance</h4>
              <div className="semester-selector">
                <label>Select Semester to Add/Edit:</label>
                <select 
                  onChange={(e) => {
                    const sem = parseInt(e.target.value);
                    if (sem && !formData.semesterAttendance.some(a => a.semester === sem)) {
                      setFormData({
                        ...formData,
                        semesterAttendance: [...formData.semesterAttendance, {
                          semester: sem,
                          percentage: 0,
                          classes: { attended: 0, total: 0 }
                        }]
                      });
                    }
                  }}
                  defaultValue=""
                >
                  <option value="">Add Semester...</option>
                  {[1, 2, 3, 4, 5, 6].map(sem => (
                    <option key={sem} value={sem} disabled={formData.semesterAttendance.some(a => a.semester === sem)}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>

              {formData.semesterAttendance.map((att, index) => (
                <div key={index} className="attendance-row">
                  <h5>Semester {att.semester}</h5>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Classes Attended</label>
                      <input
                        type="number"
                        value={att.classes?.attended || 0}
                        onChange={(e) => handleAttendanceChange(att.semester, 'classes', {
                          ...att.classes,
                          attended: parseInt(e.target.value)
                        })}
                        min="0"
                        placeholder="45"
                      />
                    </div>
                    <div className="form-group">
                      <label>Total Classes</label>
                      <input
                        type="number"
                        value={att.classes?.total || 0}
                        onChange={(e) => handleAttendanceChange(att.semester, 'classes', {
                          ...att.classes,
                          total: parseInt(e.target.value)
                        })}
                        min="0"
                        placeholder="50"
                      />
                    </div>
                    <div className="form-group">
                      <label>Attendance %</label>
                      <input
                        type="number"
                        value={att.percentage || 0}
                        onChange={(e) => handleAttendanceChange(att.semester, 'percentage', parseInt(e.target.value))}
                        min="0"
                        max="100"
                        placeholder="90"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-submit" onClick={handleSubmit}>Save Student</button>
        </div>
      </div>
    </div>
  );
};

export default StudentModal;
