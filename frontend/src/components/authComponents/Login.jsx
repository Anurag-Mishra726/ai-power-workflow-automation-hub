import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../schemas/loginSchema";
import { useLogin } from "../../hooks/useAuth";
import useAuthStore from "../../stores/authStore";
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-hot-toast';

const Login = () => {

  const loginMutaion = useLogin();
  const navigate = useNavigate();
  const setAuth = useAuthStore( (state) => state.setAuth );

  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
   } = useForm({
        resolver: zodResolver(loginSchema),
   });

  const onSubmit = async(data) => {
    console.log("Form Data : ", data);
    try {
        const userData = await loginMutaion.mutateAsync(data);
        console.log("Login jsx : ", userData.data);
        setAuth(userData.data);
        toast.success("Login Successful");
        navigate('/home');
    } catch (error) {
        toast.error(error);
        console.error("Login Error: ", error);
    }
    reset();
  }

  return (
    <>
      <div className="form-container auth-transition auth-login mt-20 ">
        <form onSubmit={handleSubmit(onSubmit)} className="form-login">

          <div className="row-1 ">
            <div className="input-fields">
              <input {...register("email")} placeholder=" " />
              <label htmlFor="email">Email</label>
              {errors.email && <p className="error text-sm text-red-600">{errors.email.message}</p>}
            </div>
          </div>

          <div className="row-2 mt-20 mb-28">
            <div className="input-fields">
              <input {...register("password")} placeholder=" " />
              <label htmlFor="password">Password</label>
              {errors.password && <p className="error text-sm text-red-600">{errors.password.message}</p>}
            </div>
          </div>

          <div className="row-3 flex flex-col justify-center items-center text-[1.4em] ">
            <button className="submit-btn" disabled= {loginMutaion.isPending} type="submit"> {loginMutaion.isPending ? "Logging in..." : "Login"} </button>
          </div>

        </form>
      </div>
    </>
  );
};

export default Login;
