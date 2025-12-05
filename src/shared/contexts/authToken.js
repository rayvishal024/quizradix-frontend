let _token = null;

export const setAuthToken = (token) => {
     _token = token;
};

export const clearAuthToken = () => {
     _token = null;
};

export const getAuthToken = () => _token;