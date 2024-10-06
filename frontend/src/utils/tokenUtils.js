import apiClient from "./apiClient";

// Get the stored access token
export const getStoredAccessToken = () => {
  return (
    localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken")
  );
};

// Set the access token in storage
export const setStoredAccessToken = (token) => {
  localStorage.setItem("accessToken", token);
};

// Remove the access token from storage
export const removeStoredAccessToken = () => {
  localStorage.removeItem("accessToken");
  sessionStorage.removeItem("accessToken");
};

// Token refresh logic
export const refreshToken = async () => {
  try {
    const response = await apiClient.post("/users/refresh");
    const { accessToken } = response.data;
    setStoredAccessToken(accessToken);
    apiClient.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${accessToken}`;
    return accessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    if (error.response && error.response.status === 403) {
      await logout(); // Use the logout function
    }
    return null; // Return null instead of throwing an error
  }
};

// Logout function
export const logout = async () => {
  try {
    await apiClient.post("/users/logout");
  } catch (error) {
    console.error("Error during logout:", error);
  } finally {
    removeStoredAccessToken();
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

// Set the access token in the API client
export const setApiClientToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};
