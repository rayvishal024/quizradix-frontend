import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { sendOtpRequest } from "../api/authApi";

const schema = z.object({
     email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

export default function RegisterEmailPage() {

     const navigate = useNavigate();
     const [loading, setLoading] = useState(false);

     const {
          register,
          handleSubmit,
          formState: { errors },
     } = useForm({
          resolver: zodResolver(schema),
          defaultValues: { email: "" },
     });


     const onSubmit = async (values) => {

          setLoading(true);

          try {

               const res = await sendOtpRequest(values.email);

               // show backend message if present, else generic
               const message = res?.message || "OTP sent to your email.";
               toast.success(message);

               // navigate to OTP verify page and lock email in route state
               navigate("/verify-otp", { state: { email: values.email } });

          } catch (err) {

               const message = err?.response?.data?.message;

               if (message) toast.error(message);
               else toast.error("Failed to send OTP. Try again.");
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
               <div className="max-w-md w-full bg-white p-8 rounded shadow">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-900">Register — Step 1</h2>
                    <p className="text-sm text-gray-600 mb-6">
                         Enter your email. We'll send a 6-digit OTP to verify your email address.
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                         <div>
                              <label className="block text-sm font-medium text-gray-700">Email</label>
                              <input
                                   type="email"
                                   {...register("email")}
                                   className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.email ? "border-red-500" : "border-gray-300"
                                        }`}
                                   aria-invalid={errors.email ? "true" : "false"}
                                   aria-describedby={errors.email ? "email-error" : undefined}
                              />
                              {errors.email && (
                                   <p id="email-error" className="text-sm text-red-600 mt-1">
                                        {errors.email.message}
                                   </p>
                              )}
                         </div>

                         <div>
                              <button
                                   type="submit"
                                   disabled={loading}
                                   className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white py-2 rounded-md flex items-center justify-center gap-2"
                              >
                                   {loading && <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                   {loading ? "Sending OTP..." : "Send OTP"}
                              </button>
                         </div>
                    </form>
               </div>
          </div>
     );
}
