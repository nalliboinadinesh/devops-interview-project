import React, { useState } from 'react';
import { FiChevronRight, FiAlertCircle, FiCheckCircle, FiUsers, FiBook, FiZap } from 'react-icons/fi';

export const CollegeRulesRegulations = () => {
  const [expandedRule, setExpandedRule] = useState(null);

  const ruleCategories = [
    {
      category: 'General Conduct',
      icon: FiUsers,
      color: 'blue',
      rules: [
        { number: 1, title: 'Admission Agreement', description: 'All candidates who secure admission are deemed to have agreed to all rules and regulations.' },
        { number: 2, title: 'Anti-Ragging & Discipline', description: 'Students must not involve in ragging or indisciplinary acts. Violation results in appropriate punishment.' },
        { number: 3, title: 'Uniform Policy', description: 'All students must wear prescribed college uniform.' },
        { number: 4, title: 'Language & Behavior', description: 'Speak English in classrooms and campus. Maintain punctuality and decorum. No loud talking.' },
        { number: 5, title: 'Campus Behavior', description: 'No gossiping in corridors. Do not sit on walls or railings. No loitering during working hours.' }
      ]
    },
    {
      category: 'Academic Rules',
      icon: FiBook,
      color: 'green',
      rules: [
        { number: 6, title: 'Attendance Requirement', description: 'Maintain minimum 75% attendance. Falling short results in exam ineligibility and no promotion.' },
        { number: 7, title: 'Classroom Discipline', description: 'Maintain strict discipline. Keep classrooms and campus neat and tidy.' },
        { number: 14, title: 'Classroom Presence', description: 'No student shall leave classroom without teacher permission until class is over.' },
        { number: 21, title: 'Canteen During Class', description: 'No student should be in the canteen during class work.' },
        { number: 22, title: 'Free Time Utilization', description: 'Spend free time in Library or Reading Room for academic development.' }
      ]
    },
    {
      category: 'Campus Safety & Security',
      icon: FiZap,
      color: 'red',
      rules: [
        { number: 8, title: 'No Mobile Phones', description: 'Students cannot bring cell phones. Found phones will be confiscated by Principal.' },
        { number: 9, title: 'No Smoking', description: 'Smoking in college campus is strictly prohibited.' },
        { number: 10, title: 'Campus Gates', description: 'College gates will be closed except during break time.' },
        { number: 12, title: 'Anti-Ragging Policy', description: 'Ragging is strictly prohibited as per Government Orders. Zero tolerance policy.' },
        { number: 13, title: 'Identity Cards', description: 'Display identity cards on person during stay in college campus.' },
        { number: 15, title: 'Vehicle Parking', description: 'Park vehicles only at designated locations.' },
        { number: 16, title: 'No Unauthorized Entry', description: 'Do not bring unauthorized persons into campus.' }
      ]
    },
    {
      category: 'Prohibited Activities',
      icon: FiAlertCircle,
      color: 'orange',
      rules: [
        { number: 11, title: 'Vehicle Regulations', description: 'No names, slogans, or posters on number plates/vehicles.' },
        { number: 17, title: 'No Strikes/Protests', description: 'Strikes and demonstrations result in automatic suspension from college.' },
        { number: 18, title: 'No Unauthorized Events', description: 'No meetings, entertainment programs, or money collection without Principal permission.' },
        { number: 19, title: 'Respect & Dignity', description: 'Criticizing or abusing girl students in foul language is strictly prohibited.' },
        { number: 20, title: 'No Personal Functions', description: 'No birthday or personal functions within campus.' },
        { number: 23, title: 'No Class Disruption', description: 'Students who disrupt lessons or cause mischief will be expelled from class.' },
        { number: 24, title: 'Fine Policy', description: 'Fines imposed for rule violations will be used for student welfare activities.' }
      ]
    },
    {
      category: 'Financial Policy',
      icon: FiCheckCircle,
      color: 'purple',
      rules: [
        { number: 25, title: 'Fee Payment Policy', description: 'All fees must be paid as prescribed. Failure results in admission cancellation. No refunds. Balance fees required if leaving college.' }
      ]
    }
  ];

  const toggleRule = (categoryIndex, ruleIndex) => {
    const key = `${categoryIndex}-${ruleIndex}`;
    setExpandedRule(expandedRule === key ? null : key);
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600 border-blue-200',
      green: 'from-green-500 to-green-600 border-green-200',
      red: 'from-red-500 to-red-600 border-red-200',
      orange: 'from-orange-500 to-orange-600 border-orange-200',
      purple: 'from-purple-500 to-purple-600 border-purple-200'
    };
    return colors[color] || colors.blue;
  };

  const getCategoryBgColor = (color) => {
    const colors = {
      blue: 'bg-blue-50',
      green: 'bg-green-50',
      red: 'bg-red-50',
      orange: 'bg-orange-50',
      purple: 'bg-purple-50'
    };
    return colors[color] || 'bg-blue-50';
  };

  return (
    <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">📋 College Rules & Regulations</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            All students are expected to adhere to these comprehensive rules and regulations to maintain a disciplined, safe, and conducive learning environment.
          </p>
        </div>

        {/* Important Banner */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-6 rounded-lg mb-10 flex items-start space-x-4">
          <FiAlertCircle className="text-red-600 flex-shrink-0 mt-1" size={28} />
          <div>
            <h3 className="font-bold text-red-900 mb-2">Important Note</h3>
            <p className="text-red-800 text-sm leading-relaxed">
              Violation of any rule may result in disciplinary action, including warnings, fines, suspension, or expulsion from college.
            </p>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-8">
          {ruleCategories.map((category, categoryIndex) => {
            const Icon = category.icon;
            const colorClasses = getColorClasses(category.color);
            const bgColor = getCategoryBgColor(category.color);

            return (
              <div key={categoryIndex} className="rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                {/* Category Header */}
                <div className={`bg-gradient-to-r ${colorClasses} p-6 flex items-center space-x-4`}>
                  <div className="flex items-center justify-center h-14 w-14 rounded-full bg-white bg-opacity-20">
                    <Icon size={28} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{category.category}</h3>
                    <p className="text-white text-opacity-90 text-sm">{category.rules.length} rules</p>
                  </div>
                </div>

                {/* Rules */}
                <div className={`${bgColor} p-4 space-y-2`}>
                  {category.rules.map((rule, ruleIndex) => {
                    const key = `${categoryIndex}-${ruleIndex}`;
                    const isExpanded = expandedRule === key;

                    return (
                      <div
                        key={ruleIndex}
                        className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                      >
                        <button
                          onClick={() => toggleRule(categoryIndex, ruleIndex)}
                          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-4 flex-1">
                            <div className={`flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-r ${colorClasses} text-white text-sm font-bold flex-shrink-0`}>
                              {rule.number}
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900">{rule.title}</h4>
                          </div>
                          <FiChevronRight
                            className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${
                              isExpanded ? 'rotate-90' : ''
                            }`}
                            size={24}
                          />
                        </button>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200">
                            <div className="flex items-start space-x-3">
                              <FiCheckCircle className={`text-gray-400 flex-shrink-0 mt-0.5`} size={20} />
                              <p className="text-gray-700 leading-relaxed text-sm">{rule.description}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <p className="text-gray-700 text-center leading-relaxed">
            <span className="font-semibold text-gray-900">Acknowledgment:</span> These rules are subject to modification by college administration. All students are required to comply with existing and future amendments.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CollegeRulesRegulations;
