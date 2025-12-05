import { useForm } from 'react-hook-form';
import LoadingSpinner from "../../../shared/components/LoadingSpinner.jsx"
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import clsx from "clsx";

// schema for validate input
const schema = z.object({
     email: z.string().min(1, "email is required").email("Enter valid email"),
     password: z.string().min(8, "Password must be at least 8 characters"),
     remember: z.boolean().optional(),
})

export default function LoginForm({ onSubmit, loading }) {


     const { register, handleSubmit, formState: { errors }, } =
          useForm({
               resolver: zodResolver(schema),
               defaultValues: { email: "", password: "", remember: false },
          });



     return (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" aria-label="login form">
               <div>
                    <label className='block text-sm font-medium text-gray-700' htmlFor='email'>
                         Email
                    </label>

                    <div className="mt-1">
                         {/* email feild */}
                         <input id='email' type='email' autoComplete="email"

                              {...register("email")}

                              className={clsx(
                                   "block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500",
                                   errors.email ? "border-red-500" : "border-gray-300"
                              )}

                              aria-invalid={errors.email ? "true" : "false"}
                              aria-describedby={errors.email ? "email-error" : undefined}
                         />

                         {/* show error */}
                         {errors.email && (
                              <p id="email-error" className="mt-1 text-sm text-red-600">
                                   {errors.email.message}
                              </p>
                         )}

                    </div>

                    <div>
                         <label className='block text-sm font-medium text-gray-700' htmlFor='password'>
                              Password
                         </label>

                         <div className="mt-1 relative">
                              <input id='password' autoComplete='password' type='password'

                                   {...register("password")}

                                   className={clsx(
                                        "block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500",
                                        errors.password ? "border-red-500" : "border-gray-300"
                                   )}

                                   aria-invalid={errors.password ? "true" : "false"}
                                   aria-describedby={errors.password ? "password-error" : undefined}
                              />
                         </div>
                         {errors.password && (
                              <p id="password-error" className="mt-1 text-sm text-red-600">
                                   {errors.password.message}
                              </p>
                         )}
                    </div>

                    <div className="flex items-center justify-between">
                         <label className="flex items-center text-sm">
                              <input type="checkbox" {...register("remember")} className="h-4 w-4 rounded border-gray-300" />
                              <span className="ml-2 text-gray-700">Remember me</span>
                         </label>

                         <div className="text-sm">
                              <a href="/forgot" className="font-medium text-indigo-600 hover:text-indigo-500">
                                   Forgot your password?
                              </a>
                         </div>
                    </div>

                    <div>
                         <button disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white py-2 rounded-md flex items-center justify-center gap-2"
>
                              {loading ? (
                                   <LoadingSpinner size={5} color="white" />
                              ) : (
                                   "Sign In"
                              )}
                         </button>

                    </div>

               </div>

          </form>
     )
}