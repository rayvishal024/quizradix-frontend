import api from "../../../api/axios";

// login request
export const loginRequest = (credentials) => {
  
     return api.post("api/auth/login", credentials)
          .then((res) => res.data);
     
};

// register request
export const registerRequest = (payload) => {

     return api.post("api/auth/register", payload)
          .then((res) => res.data);
};

// send otp request 
export const sendOtpRequest = (email) => {

     return api.post("api/otp/sendotp", { email })
          .then((res) => res.data);
};

// verify otp 
export const verifyOtpRequest = (payload) => {
 
     return api.post("api/otp/verifyotp", payload).
          then((res) => res.data);
};
