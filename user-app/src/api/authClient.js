/**
 * Simple Auth Client
 * Handles JWT tokens, OTP-based login, logout, user info
 */

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class AuthClient {
  constructor() {
    this.token = localStorage.getItem('auth_token');
    this.user = null;
  }

  /**
   * Send OTP to email
   */
  async sendOTP(email) {
    try {
      const response = await axios.post(`${API_URL}/auth/send-otp`, { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  /**
   * Verify OTP and login
   */
  async verifyOTP(email, otp) {
    try {
      const response = await axios.post(`${API_URL}/auth/verify-otp`, { email, otp });
      
      if (response.data.tokens?.accessToken) {
        localStorage.setItem('auth_token', response.data.tokens.accessToken);
        this.token = response.data.tokens.accessToken;
        this.user = response.data.user;
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  /**
   * Login with email and password (fallback)
   */
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      if (response.data.tokens?.accessToken) {
        localStorage.setItem('auth_token', response.data.tokens.accessToken);
        this.token = response.data.tokens.accessToken;
        this.user = response.data.user;
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('auth_token');
    this.token = null;
    this.user = null;
  }

  /**
   * Get current token
   */
  getToken() {
    return localStorage.getItem('auth_token');
  }

  /**
   * Get current user from token (decode JWT)
   */
  getCurrentUser() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  /**
   * Check if user is admin
   */
  isAdmin() {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  /**
   * Check if authenticated
   */
  isAuthenticated() {
    return !!this.getToken();
  }
}

export const authClient = new AuthClient();
