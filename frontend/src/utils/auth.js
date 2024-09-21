import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Ensure this import is correct

// Function to check if the token has expired
const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    const bufferTime = 60; // Buffer time (in seconds)
    
    return decoded.exp < (currentTime + bufferTime);
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // Consider token expired if decoding fails
  }
};

export const refreshToken = async () => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  console.log('Token:', token); 
  console.log('RefreshToken:', refreshToken);

  if (!token || !refreshToken) {
    console.error('Tokens missing');
    return null; // Signal that tokens are missing
  }

  if (!isTokenExpired(token)) {
    console.log('Token is still valid.');
    return token; // Return the existing valid token
  }

  try {
    // Request to refresh the token
    const response = await axios.post('http://localhost:5000/api/users/refresh', { refreshToken });

    // Update tokens in local storage
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    
    console.log('Token refreshed successfully.');
    return response.data.token; // Return the new token
  } catch (error) {
    console.error('Error refreshing token:', error);

    if (error.response && error.response.status === 401) {
      // Invalidate tokens if refresh fails
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      return null; // Signal that the refresh failed
    } else {
      alert('Failed to refresh token. Please try again.');
      return null; // General failure
    }
  }
};
