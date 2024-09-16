import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Use this to decode JWT

// Function to check if the token has expired
const isTokenExpired = (token) => {
  if (!token) return true;

  const decoded = jwtDecode(token);
  const currentTime = Date.now() / 1000; // In seconds

  return decoded.exp < currentTime;
};

export const refreshToken = async () => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  console.log('Token:', token); 
  console.log('RefreshToken:', refreshToken);

  // Handle case when tokens are missing
  if (!token || !refreshToken) {
    console.error('Tokens missing');
    // Optionally redirect to login page here
    window.location.href = '/login'; 
    return;
  }

  // Check if the token has expired
  if (!isTokenExpired(token)) {
    console.log('Token is still valid.');
    return;
  }

  try {
    // Send request to refresh token
    const response = await axios.post('http://localhost:5000/api/auth/refresh', { refreshToken });

    localStorage.setItem('token', response.data.token);
    localStorage.setItem('refreshToken', response.data.refreshToken);
  } catch (error) {
    console.error('Error refreshing token:', error);

    // Handle specific errors like token expiry or network issues
    if (error.response && error.response.status === 401) {
      // Refresh token expired or invalid, redirect to login
      window.location.href = '/login';
    } else {
      // Handle other errors (e.g., network issues)
      alert('Failed to refresh token. Please try again.');
    }
  }
};
