import { useForm } from 'react-hook-form';
import { useAuth } from '../../../shared/contexts/AuthContext.jsx'
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import clsx from "clsx";

// schema for validate input
const schema = z.object({
     email: z.string().min(1, "email is required").email("Enter valid email"),
     password: zodResolver.string().min(8, "Password must be at least 8 characters"),
     remember: z.boolean().optional(),
})

export default function LoginForm({ onSubmit, loading }) {


     const { register, handleSubmit, formState: { errors }, } =
          useForm({
               resolver: zodResolver(schema),
               defaultValues: { email: "", password: "", remember: false },
         });



     return (
          <form onSubmit={handleSubmit(onSubmit)}>

               <input {...register("email", { required: true })} />
               <input {...register("password", { required: true, min: 8 })} />

               <input type="submit" />

          </form>
     )
}