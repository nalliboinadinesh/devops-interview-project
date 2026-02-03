import React from 'react';

const About = () => (
  <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8 mt-8 mb-8 flex flex-col md:flex-row items-center gap-8">
    <img
      src="https://abhi-crr.s3.ap-south-1.amazonaws.com/c-r-reddy-polytechnic-college-west-godavari-polytechnic-colleges-9iwgbyhfq3.avif"
      alt="C.R. Reddy Polytechnic College"
      className="w-full md:w-1/2 rounded-lg object-cover shadow-lg border border-gray-200"
      style={{ maxHeight: 320 }}
    />
    <div className="flex-1">
      <h2 className="text-3xl font-bold mb-4 text-blue-900">About Sir C.R. Reddy Polytechnic College</h2>
      <p className="text-gray-700 mb-2">
        Sir C.R. Reddy Polytechnic College, West Godavari, is a premier institution dedicated to providing quality technical education and fostering innovation. Our mission is to empower students with the skills and knowledge required to excel in their chosen fields and contribute to society.
      </p>
      <p className="text-gray-700">
        We offer a wide range of diploma programs, state-of-the-art facilities, and a vibrant campus life. Our experienced faculty and industry partnerships ensure that students receive both academic excellence and practical exposure.
      </p>
    </div>
  </div>
);

export default About;
