import React from 'react';

const Footer = () => (
  <footer className="w-full bg-blue-900 text-white py-4 mt-8 shadow-inner">
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
      <span className="text-sm">&copy; {new Date().getFullYear()} Sir C.R. Reddy Admin. All rights reserved.</span>
      <span className="text-xs mt-2 md:mt-0">Designed & Developed by the CRR Admin Team</span>
    </div>
  </footer>
);

export default Footer;
