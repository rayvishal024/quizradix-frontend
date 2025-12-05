// src/features/auth/pages/OtpVerifyPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { verifyOtpRequest, sendOtpRequest } from "../api/authApi";

const schema = z.object({
     otp: z
          .string()
          .min(6, "OTP must be 6 digits")
          .max(6, "OTP must be 6 digits")
          .regex(/^\d{6}$/, "OTP must be numeric"),
});

export default function OtpVerifyPage() {
     const navigate = useNavigate();
     const location = useLocation();
     const email = location.state?.email || null;

     // If no email in state, redirect to email entry page
     useEffect(() => {
          if (!email) {
               navigate("/register-email", { replace: true });
          }
     }, [email, navigate]);

     const [loading, setLoading] = useState(false);
     const [resendLoading, setResendLoading] = useState(false);

     // 2 minute cooldown
     const COOLDOWN = 120; // seconds
     const [remaining, setRemaining] = useState(COOLDOWN);
     const timerRef = useRef(null);
     const [canResend, setCanResend] = useState(false);

     useEffect(() => {
          // start countdown on mount
          setCanResend(false);
          setRemaining(COOLDOWN);

          timerRef.current = setInterval(() => {
               setRemaining((r) => {
                    if (r <= 1) {
                         clearInterval(timerRef.current);
                         setCanResend(true);
                         return 0;
                    }
                    return r - 1;
               });
          }, 1000);

          return () => clearInterval(timerRef.current);
     }, []);

     const {
          register,
          handleSubmit,
          formState: { errors },
     } = useForm({
          resolver: zodResolver(schema),
          defaultValues: { otp: "" },
     });

     const onSubmit = async (values) => {
          if (!email) return; // guard
          setLoading(true);
          try {
               const payload = { email, otp: values.otp };
               const res = await verifyOtpRequest(payload);
               const msg = res?.message || "OTP verified";
               toast.success(msg);

               // Navigate to final registration page; keep email locked in state
               navigate("/register", { state: { email } });
          } catch (err) {
               const backend = err?.response?.data?.message;
               if (backend) toast.error(backend);
               else toast.error("OTP verification failed. Try again.");
          } finally {
               setLoading(false);
          }
     };

     const handleResend = async () => {
          if (!email) return;
          if (!canResend) return;
          setResendLoading(true);
          try {
               const res = await sendOtpRequest(email);
               const msg = res?.message || "OTP resent to your email.";
               toast.success(msg);

               // restart cooldown
               setCanResend(false);
               setRemaining(COOLDOWN);
               timerRef.current = setInterval(() => {
                    setRemaining((r) => {
                         if (r <= 1) {
                              clearInterval(timerRef.current);
                              setCanResend(true);
                              return 0;
                         }
                         return r - 1;
                    });
               }, 1000);
          } catch (err) {
               const backend = err?.response?.data?.message;
               if (backend) toast.error(backend);
               else toast.error("Failed to resend OTP. Try again later.");
          } finally {
               setResendLoading(false);
          }
     };

     const formatTime = (sec) => {
          const mm = String(Math.floor(sec / 60)).padStart(2, "0");
          const ss = String(sec % 60).padStart(2, "0");
          return `${mm}:${ss}`;
     };

     return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
               <div className="max-w-md w-full bg-white p-8 rounded shadow">
                    <h2 className="text-2xl font-semibold mb-2 text-gray-900">Verify OTP — Step 2</h2>
                    <p className="text-sm text-gray-600 mb-4">We sent a 6-digit code to <strong>{email}</strong></p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                         <div>
                              <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                              <input
                                   type="text"
                                   inputMode="numeric"
                                   maxLength={6}
                                   {...register("otp")}
                                   className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.otp ? "border-red-500" : "border-gray-300"
                                        }`}
                                   aria-invalid={errors.otp ? "true" : "false"}
                                   aria-describedby={errors.otp ? "otp-error" : undefined}
                              />
                              {errors.otp && (
                                   <p id="otp-error" className="text-sm text-red-600 mt-1">
                                        {errors.otp.message}
                                   </p>
                              )}
                         </div>

                         <div className="flex items-center gap-2">
                              <button
                                   type="submit"
                                   disabled={loading}
                                   className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white py-2 px-4 rounded-md"
                              >
                                   {loading && <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                   {loading ? "Verifying..." : "Verify OTP"}
                              </button>

                              <button
                                   type="button"
                                   onClick={handleResend}
                                   disabled={!canResend || resendLoading}
                                   className="ml-auto text-sm text-indigo-600 underline disabled:text-gray-400"
                              >
                                   {resendLoading ? "Resending..." : canResend ? "Resend OTP" : `Resend in ${formatTime(remaining)}`}
                              </button>
                         </div>
                    </form>

                    <p className="text-xs text-gray-500 mt-4">
                         If you did not receive the email, check your spam folder or try resending after the timer.
                    </p>
               </div>
          </div>
     );
}
