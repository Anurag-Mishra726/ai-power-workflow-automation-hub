import "./Signup.css"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "../../schemas/signupSchema";
import { useSignup } from "../../hooks/useAuth";
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-hot-toast';


const Signup = () => {

    const signupMutation = useSignup();
    const navigate = useNavigate();

   const {
    register,
    handleSubmit,
    formState: {errors},
    reset, 
   } = useForm({
        resolver: zodResolver(signupSchema),
   });

   const onSubmit = async (data) => {
    console.log("Form Data : ", data);
    try {
        await signupMutation.mutateAsync(data);
        toast.success("Signup Successful");
        navigate('/home');
    } catch (error) {
        console.error("Signup Error: ", error);
        toast.error(error);
    }
    reset();
   }


  return (
    <>
      <div className="form-container auth-transition auth-signup mt-20">
        <form onSubmit={handleSubmit(onSubmit)} className='form-signup flex flex-col gap-12 md:gap-28'>

            {/* <div className='row-1 flex justify-between gap-16 w-full '> */}
<div className="row-1 flex flex-col md:flex-row gap-8 w-full">
                <div className="input-fields">
                    <input {...register("username")} placeholder=" " />
                    <label htmlFor="username">Username</label>
                    {errors.username && <p className="error text-sm">{errors.username.message}</p>}

                </div>

                <div className="input-fields">
                    <input {...register("email")} placeholder=" " />
                    <label htmlFor="email">Email</label>
                    {errors.email && <p className="error text-sm">{errors.email.message}</p>}
                </div>
            </div>

            {/* <div className='row-2 flex justify-between gap-16 w-full'> */}
<div className="row-2 flex flex-col md:flex-row gap-8 w-full">

                <div className="input-fields">
                    <input {...register("password")} placeholder=" " />
                <label htmlFor="password">Password</label>
                    {errors.password && <p className="error text-sm ">{errors.password.message}</p>}

                </div>

                <div className="input-fields">
                    <input {...register("confirmPassword")} placeholder=" " />
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    {errors.confirmPassword && <p className="error text-sm">{errors.confirmPassword.message}</p>}

                </div>
            </div>

            <div className='row-3 flex flex-col justify-center items-center text-[1.4em] gap-[0.7em] mt-[-1em] '>
                <button className="submit-btn" disabled= {signupMutation.isPending} type='submit' >{signupMutation.isPending ? "Signing up..." : "Sign Up"}</button>
            </div>
        </form>
      </div>
    </>
  )
}

export default Signup
