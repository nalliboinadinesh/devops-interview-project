import React from 'react';
import { FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

export const Footer = () => {
  return (
    <footer className="bg-blue-900 text-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center">
                <span className="text-blue-900 font-bold text-sm">🏫</span>
              </div>
              <h3 className="text-white font-bold text-lg">Polytechnic College</h3>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Engineering students with technical education and practical skills for a successful career in engineering.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-yellow-500 font-bold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/#" className="text-gray-300 hover:text-white transition duration-300 flex items-center gap-2">
                <span>→</span> Home
              </a></li>
              <li><a href="/notes" className="text-gray-300 hover:text-white transition duration-300 flex items-center gap-2">
                <span>→</span> Study Materials
              </a></li>
              <li><a href="/question-papers" className="text-gray-300 hover:text-white transition duration-300 flex items-center gap-2">
                <span>→</span> Question Papers
              </a></li>
              <li><a href="/announcements" className="text-gray-300 hover:text-white transition duration-300 flex items-center gap-2">
                <span>→</span> Announcements
              </a></li>
              <li><a href="/about" className="text-gray-300 hover:text-white transition duration-300 flex items-center gap-2">
                <span>→</span> About
              </a></li>
            </ul>
          </div>

          {/* Academics */}
          <div>
            <h3 className="text-yellow-500 font-bold mb-4 text-lg">Academics</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="/#" className="text-gray-300 hover:text-white transition duration-300">Departments</a></li>
              <li><a href="/#" className="text-gray-300 hover:text-white transition duration-300">Programs</a></li>
              <li><a href="/notes" className="text-gray-300 hover:text-white transition duration-300">Course Materials</a></li>
              <li><a href="/#" className="text-gray-300 hover:text-white transition duration-300">Faculty Directory</a></li>
              <li><a href="/#" className="text-gray-300 hover:text-white transition duration-300">Admissions</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-yellow-500 font-bold mb-4 text-lg">Contact Us</h3>
            <div className="space-y-4 text-sm">
              <div className="flex gap-3">
                <FiMapPin className="text-yellow-500 flex-shrink-0 mt-1" size={18} />
                <div>
                  <p className="text-gray-300">123 College Road,</p>
                  <p className="text-gray-300">Education City - 560001</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <FiPhone className="text-yellow-500 flex-shrink-0 mt-1" size={18} />
                <p className="text-gray-300">+91 123 XXXX-XXXX</p>
              </div>
              <div className="flex gap-3 items-start">
                <FiMail className="text-yellow-500 flex-shrink-0 mt-1" size={18} />
                <p className="text-gray-300">info@polytechnic.edu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-800"></div>

        {/* Copyright */}
        <div className="pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 Polytechnic College. All rights reserved. | Student Information System v1.0</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
