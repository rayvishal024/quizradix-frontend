import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { registerRequest } from "../api/authApi";

// validate with zod
const schema = z
     .object({
          name: z.string().min(2, "Name must be at least 2 characters"),
          email: z.string().email(),
          password: z.string().min(8, "Password must be at least 8 characters"),
          confirmPassword: z.string().min(1),
          role: z.enum(["student", "tutor"], { errorMap: () => ({ message: "Role is required" }) }),
     })
     .refine((data) => data.password === data.confirmPassword, {
          path: ["confirmPassword"],
          message: "Passwords do not match",
     });


export default function RegisterPage() {

     const navigate = useNavigate();
     const location = useLocation();
     const email = location.state?.email || null;

     // If no verified email, redirect back to email step
     useEffect(() => {
          if (!email) {
               navigate("/register-email", { replace: true });
          }
     }, [email, navigate]);


     const [loading, setLoading] = useState(false);

     const {
          register,
          handleSubmit,
          formState: { errors },
          setValue,
     } = useForm({
          resolver: zodResolver(schema),
          defaultValues: { name: "", email: email || "", password: "", confirmPassword: "", role: "student" },
     });


     // ensure email field is readonly and has correct value
     useEffect(() => {
          if (email) setValue("email", email);
     }, [email, setValue]);

     const onSubmit = async (values) => {
          setLoading(true);

          try {
               const payload = {
                    name: values.name,
                    email: values.email,
                    password: values.password,
                    role: values.role,
               };

               const res = await registerRequest(payload);
               const msg = res?.message || "Account created successfully";
               toast.success(msg);

               // redirect to login
               navigate("/login", { replace: true });
          } catch (err) {

               console.log(err)
               const res = err?.response?.data?.errors;
               if (res)
                    res.forEach((msg) => {
                         toast.error(msg);
                    })
               else toast.error("Registration failed. Try again.");
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
               <div className="max-w-md w-full bg-white p-8 rounded shadow">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900">Complete Registration — Step 3</h2>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                         <div>
                              <label className="block text-sm font-medium text-gray-700">Full Name</label>
                              <input
                                   type="text"
                                   {...register("name")}
                                   className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.name ? "border-red-500" : "border-gray-300"
                                        }`}
                              />
                              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
                         </div>

                         <div>
                              <label className="block text-sm font-medium text-gray-700">Email</label>
                              <input
                                   type="email"
                                   {...register("email")}
                                   readOnly
                                   className="mt-1 block w-full rounded-md border px-3 py-2 bg-gray-100 cursor-not-allowed border-gray-300"
                              />
                              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
                         </div>

                         <div>
                              <label className="block text-sm font-medium text-gray-700">Password</label>
                              <input
                                   type="password"
                                   {...register("password")}
                                   className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.password ? "border-red-500" : "border-gray-300"
                                        }`}
                              />
                              {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
                         </div>

                         <div>
                              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                              <input
                                   type="password"
                                   {...register("confirmPassword")}
                                   className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.confirmPassword ? "border-red-500" : "border-gray-300"
                                        }`}
                              />
                              {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>}
                         </div>

                         <div>
                              <label className="block text-sm font-medium text-gray-700">Role</label>
                              <select
                                   {...register("role")}
                                   className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.role ? "border-red-500" : "border-gray-300"
                                        }`}
                              >
                                   <option value="student">Student</option>
                                   <option value="tutor">Tutor</option>
                              </select>
                              {errors.role && <p className="text-sm text-red-600 mt-1">{errors.role.message}</p>}
                         </div>

                         <div>
                              <button
                                   type="submit"
                                   disabled={loading}
                                   className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white py-2 rounded-md flex items-center justify-center gap-2"
                              >
                                   {loading && <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                   {loading ? "Creating account..." : "Create account"}
                              </button>
                         </div>
                    </form>
               </div>
          </div>
     );
}