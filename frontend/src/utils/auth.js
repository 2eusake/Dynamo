import axios from 'axios';

export const refreshToken = async () => {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  console.log('Token:', token); 
  console.log('RefreshToken:', refreshToken);

  if (!token || !refreshToken) {
    // Handle the case where tokens are missing
    console.error('Tokens missing');
    return;
  }

  try {
    // Verify if the token is expired by checking expiration time
    const response = await axios.post('http://localhost:5000/api/auth/refresh', { refreshToken });

    localStorage.setItem('token', response.data.token);
    localStorage.setItem('refreshToken', response.data.refreshToken);
  } catch (error) {
    console.error('Error refreshing token:', error);
    // Redirect to login or handle the error as appropriate
  }
};
