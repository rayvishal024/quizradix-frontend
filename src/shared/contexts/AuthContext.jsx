import React, { createContext, useContext, useRef, useState } from "react";
import { setAuthToken, clearAuthToken } from "./authToken";
import { loginRequest, registerRequest, sendOtpRequest, verifyOtpRequest } from "../../features/auth/api/authApi";
import api from "../../api/axios";


// Create Auth Context
const AuthContext = createContext(null);


// Auth Provider component
export const AuthProvider = ({ children }) => {
   
     const [user, setUser] = useState(null);
     const tokenRef = useRef(null);


     // set token 
     const setToken = (token) => {
          tokenRef.current = token;
          setAuthToken(token);
     };

     // clear token
     const clearToken = () => {
          tokenRef.current = null;
          clearAuthToken();
     };

     // get token
     const getToken = () => tokenRef.current;

     // login flow
     const login = async (credentials) => {
     
          const data = await loginRequest(credentials);
         
          const token = data.token;
          const userObj = data.user;

          if (!token) {
               throw new Error("No token received from login response");
          }

          setToken(token);
          setUser(userObj);
          return data;
     };

     // register flow 
     const register = async (payload) => {
          const res = await registerRequest(payload);
          return res;
     };

     // send otp
     const sendOtp = async (email) => {
          return sendOtpRequest(email);
     };

     // verify otp
     const verifyOtp = async (payload) => {
          return verifyOtpRequest(payload);
     };

     // logout flow
     const logout = () => {
          
          // clear client-side state
          clearToken();
          setUser(null);

          window.location.href = "/login";
     };


     return (
          <AuthContext.Provider value={{ user, setUser, login, register, logout, sendOtp, verifyOtp, getToken, setToken }}>
               {children}
          </AuthContext.Provider>
     );
};


export const useAuth = () => useContext(AuthContext);