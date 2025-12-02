// src/api/axios.js
import axios from "axios";
import { getAuthToken, clearAuthToken } from "../shared/contexts/authToken.js";

// base url for backend
const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://quizradix-backend.onrender.com/";

// create api 
const api = axios.create({
     baseURL: API_BASE,
     withCredentials: true, 
     headers: {
          "Content-Type": "application/json",
     },
});

// Attach token to requests
api.interceptors.request.use((config) => {

     // take auth token
     const token = getAuthToken();

     if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
});


// Global response handler: on 401 clear token and redirect to login
api.interceptors.response.use(
     (res) => res,
     
     (error) => {
          const status = error?.response?.status;

          // status 401
          if (status === 401) {

               // clear module token immediately
               clearAuthToken();

           try {
                    // If app is mounted, redirect to login page
                    window.location.href = "/login";
               } catch (e) {
                    // noop
               }
          }
          return Promise.reject(error);
     }
);

export default api;
