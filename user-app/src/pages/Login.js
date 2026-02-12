import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogIn, FiMail } from 'react-icons/fi';
import { authClient } from '../api/authClient';

const Login = () => {
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [error, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setMessage('');
    setLoading(true);

    try {
      const response = await authClient.sendOTP(email);
      setMessage(response.message);
      setStep('otp');
    } catch (error) {
      const message = error.message || 'Failed to send OTP. Please try again.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setMessage('');
    setLoading(true);

    try {
      const response = await authClient.verifyOTP(email, otp);
      navigate('/');
    } catch (error) {
      const message = error.message || 'OTP verification failed. Please try again.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 text-white mx-auto mb-4">
              <FiLogIn size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Portal</h1>
            <p className="text-gray-600">Polytechnic College SIS</p>
          </div>

          {/* Step 1: Email Entry */}
          {step === 'email' && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              {message && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                  {message}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <FiMail className="mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="Enter your email"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  ℹ️ Only authorized email accounts can login
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
                ✓ OTP sent to <strong>{email}</strong>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength="6"
                  className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  placeholder="000000"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  6-digit OTP (valid for 10 minutes)
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setOTP('');
                  setErrorMsg('');
                  setMessage('');
                }}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Back to Email
              </button>
            </form>
          )}

          <p className="text-center text-gray-600 text-sm mt-6">
            Authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
