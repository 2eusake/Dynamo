import apiClient from './apiClient';

// Token refresh logic
export const refreshToken = async () => {
  try {
    const response = await apiClient.post('/users/refresh'); 
    const { accessToken } = response.data; // Assuming new accessToken is returned
    // Update axios instance to use new access token
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    return accessToken; // Return the new access token
  } catch (error) {
    console.error('Token refresh failed:', error);
    if (error.response && error.response.status === 403) {
      logout(); // Log out if refresh token is invalid
    }
    throw error;
  }
};

export const logout = async () => {
  try {
    await apiClient.post('/users/logout');
    window.location.href = '/login'; // Redirect to login
  } catch (error) {
    console.error('Error during logout:', error);
    window.location.href = '/login'; // Redirect to login even on error
  }
};
