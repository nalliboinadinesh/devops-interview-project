import React, { useEffect, useState } from 'react';
import { branchAPI } from '../services/api';
import { FiUsers, FiBook, FiFileText, FiAward, FiMapPin, FiPhone, FiGlobe } from 'react-icons/fi';

const About = () => {
  const [branches, setBranches] = useState([]);

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

  const stats = [
    { label: '30+', description: 'Years of Excellence' },
    { label: 'Thousands', description: 'Students Graduated' },
    { label: '100%', description: 'Placement Support' },
    { label: 'AICTE', description: 'Accredited' }
  ];

  const facilities = [
    {
      icon: FiBook,
      title: 'Modern Laboratories',
      description: 'State-of-the-art laboratories equipped with latest technology and industry-standard tools'
    },
    {
      icon: FiGlobe,
      title: 'Wi-Fi Campus',
      description: 'Complete wireless connectivity across the entire campus for seamless learning'
    },
    {
      icon: FiBook,
      title: 'Central Library',
      description: 'Comprehensive collection of books, journals, and digital resources for research'
    },
    {
      icon: FiAward,
      title: 'Workshops & Computer Center',
      description: 'Well-equipped workshops and high-speed computing facilities available 24/7'
    },
    {
      icon: FiUsers,
      title: 'Cafeteria & Mess',
      description: 'Nutritious and affordable meals ensuring student well-being and comfort'
    },
    {
      icon: FiFileText,
      title: 'Training & Placement Cell',
      description: 'Active career counselling, internship support, and placement drives'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      {/* Hero Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <img src="https://abhi-crr.s3.ap-south-1.amazonaws.com/300060993_467370488735241_2637983149385496727_n.jpg" alt="CRR Logo" className="h-24 w-24 rounded-full object-cover border-4 border-blue-600 shadow-lg" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">🌟 Sir C.R. Reddy Polytechnic College</h1>
            <p className="text-lg text-gray-600 mb-6">Excellence in Technical Education</p>
            
            {/* Contact & Location Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center justify-center space-x-2">
                <FiMapPin className="text-blue-600" size={20} />
                <p className="text-gray-700">
                  <strong>Location:</strong> Eluru – 534007, Andhra Pradesh
                </p>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <FiPhone className="text-blue-600" size={20} />
                <p className="text-gray-700">
                  <strong>Contact:</strong> +91 99591 12939
                </p>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <FiGlobe className="text-blue-600" size={20} />
                <p className="text-gray-700">
                  <strong>Affiliation:</strong> AICTE / AP State Board
                </p>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg text-center">
                  <p className="text-3xl font-bold text-blue-600 mb-2">{stat.label}</p>
                  <p className="text-gray-700 text-sm">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* College Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">📘 About the College</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Sir C. Ramalinga Reddy Polytechnic is a well-known private polytechnic recognized by AICTE (All India Council for Technical Education) 
                and affiliated to the AP State Board of Technical Education and Training.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                With over 30 years of institutional legacy, we have developed strong infrastructure with modern laboratories, workshops, 
                and industry-aligned training aimed at producing skilled diploma engineers. Our commitment extends beyond academics to include 
                comprehensive career counselling, internship support, and placement drives.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Located near Vatluru Flyover in Eluru, our campus provides an ideal environment for learning and professional development. 
                We focus on bridging the gap between academic knowledge and industry requirements.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our placement support rate is exceptionally high, with dedicated efforts to ensure every graduate finds suitable career opportunities 
                in reputed organizations across various sectors.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg overflow-hidden h-96">
              <img
                src="https://abhi-crr.s3.ap-south-1.amazonaws.com/c-r-reddy-polytechnic-college-west-godavari-polytechnic-colleges-9iwgbyhfq3.avif"
                alt="College Campus"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Engineering Branches */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">🏫 Engineering Branches</h2>
          <p className="text-center text-gray-600 mb-12">
            We offer specialized diploma programs across multiple engineering disciplines
          </p>

          {branches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {branches.map((branch) => (
                <div key={branch._id} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 hover:shadow-lg transition-shadow text-center border-l-4 border-blue-500">
                  <h3 className="text-lg font-bold text-gray-900">{branch.name}</h3>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600 text-lg">Engineering branches information is being updated</p>
            </div>
          )}
        </div>
      </div>

      {/* Campus Facilities */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">🧪 Campus Facilities</h2>
        <p className="text-center text-gray-600 mb-12">
          World-class infrastructure supporting learning, innovation, and student development
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((facility, index) => {
            const Icon = facility.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-t-4 border-blue-500">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center justify-center h-14 w-14 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{facility.title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{facility.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">🎓 Join Our Community</h2>
          <p className="text-xl text-blue-100 mb-8">
            Be part of a legacy of 30+ years of excellence and innovation. Build your future with Sir C.R. Reddy Polytechnic College.
          </p>
          <a 
            href="https://sircrrpolytechnic.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-8 rounded-lg transition-colors shadow-lg"
          >
            Learn About Admissions
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
