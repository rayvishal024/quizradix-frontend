import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {LoginForm, useAuth} from "../../../index.js"
import toast from "react-hot-toast";


export default function LoginPage() {

     const { login } = useAuth();
     const navigate = useNavigate();
     const location = useLocation();
     const [loading, setLoading] = useState(false);

     // current route
     const from = location.state?.from || null;

     // methode for submit 
     const handleSubmit = async (values) => {
          setLoading(true);

          try {
               // send request to backend
               const data = await login({
                    email: values.email,
                    password: values.password
               })
  
               const user = data?.user || null;
               const role = user?.role?.toLowerCase() || "";
  
               toast.success("Logged in successfully!");
               console.log("success", user, role)
  
               // redirect user where they were trying to go
               if (from) {
                    navigate(from, { replace: true });
                    return;
               }
  
               // redirect by role 
               if (role === "tutor") {
                    navigate("/tutor/dashboard", { replace: true });
               } else {
                    navigate("/student/dashboard", { replace: true });
               }
  
          }
          catch (error) {

               const status = error?.status;

               if (status === 400 || status === 401) {
                    toast.error("Invalid email or password.");
               } else {
                    toast.error("Login failed. Try again later.");
               }
          }
          finally {
               setLoading(false);
          }
     };

     return (
          <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6">
               <div className="max-w-md w-full mx-auto">
                    <h1 className="text-center text-3xl font-extrabold text-gray-900">quizRadix</h1>
                    <p className="mt-2 text-center text-sm text-gray-600">
                         Sign in to your account to continue
                    </p>

                    <div className="mt-8 bg-white py-8 px-6 shadow rounded-lg">
                         <LoginForm onSubmit={handleSubmit} loading={loading} />

                         <div className="mt-6 text-center text-sm text-gray-600">
                              Don’t have an account?{" "}
                              <Link
                                   to="/register-email"
                                   className="font-medium text-indigo-600 hover:text-indigo-500"
                              >
                                   Register
                              </Link>
                         </div>
                    </div>
               </div>
          </div>
     );

}