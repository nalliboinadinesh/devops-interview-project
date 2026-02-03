import React from 'react';
import { FiBookOpen, FiFileText, FiBell } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export const AcademicResources = () => {
  const resources = [
    {
      icon: FiBookOpen,
      title: 'Study Notes',
      description: 'Access comprehensive notes and study materials for all subjects',
      link: '/notes',
      color: 'bg-blue-500'
    },
    {
      icon: FiFileText,
      title: 'Question Papers',
      description: 'Previous year exam papers to help you prepare for examinations',
      link: '/question-papers',
      color: 'bg-purple-500'
    },
    {
      icon: FiBell,
      title: 'Announcements',
      description: 'Stay updated with latest college news and important announcements',
      link: '/announcements',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Academic Resources</h2>
          <p className="text-gray-600">Access study materials, previous question papers, and important announcements.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <Link
                key={index}
                to={resource.link}
                className="group bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className={`${resource.color} h-16 flex items-center justify-center group-hover:opacity-90 transition-opacity`}>
                  <Icon className="text-white" size={32} />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-gray-600 text-sm">{resource.description}</p>
                  <div className="mt-4 text-blue-600 font-semibold text-sm group-hover:text-blue-700">
                    View All →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AcademicResources;
