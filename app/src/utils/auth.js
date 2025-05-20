// Token management
export const getToken = () => localStorage.getItem('token');
export const setToken = (token) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');

// User management
export const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};
export const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));
export const removeUser = () => localStorage.removeItem('user');

// Check if user is authenticated
export const isAuthenticated = () => {
    return !!getToken();
};

// Handle authentication
export const handleAuthentication = (response) => {
    const { token, user } = response;
    setToken(token);
    setUser(user);
};

// Handle logout
export const logout = () => {
    removeToken();
    removeUser();
};

// Get auth header
export const getAuthHeader = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}; 