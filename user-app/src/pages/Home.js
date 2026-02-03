import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import BannerCarousel from '../components/BannerCarousel';
import StudentSearch from '../components/StudentSearch';
import StudentDetails from '../components/StudentDetails';
import StudentInfo from './StudentInfo';
import AcademicResources from '../components/AcademicResources';
import CollegeRulesRegulations from '../components/CollegeRulesRegulations';

const Home = () => {
  const student = useSelector((state) => state.student.student);
  const [showStudentInfo, setShowStudentInfo] = useState(false);

  const handleViewDetails = () => {
    setShowStudentInfo(true);
  };

  const handleCloseStudentInfo = () => {
    setShowStudentInfo(false);
  };

  return (
    <div className="min-h-screen">
      {/* Banner Carousel */}
      <div className="mt-16">
        <BannerCarousel />
      </div>

      {student ? (
        <>
          {/* Student Details */}
          <StudentDetails onViewDetails={handleViewDetails} />
          
          {/* Student Info Modal */}
          {showStudentInfo && <StudentInfo onClose={handleCloseStudentInfo} />}
        </>
      ) : (
        <>
          {/* Search Section */}
          <StudentSearch />

          {/* Academic Resources */}
          <AcademicResources />

          {/* College Rules & Regulations */}
          <CollegeRulesRegulations />
        </>
      )}
    </div>
  );
};

export default Home;
