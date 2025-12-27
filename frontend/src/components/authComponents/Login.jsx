import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../schemas/loginSchema";

const Login = () => {

  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
   } = useForm({
        resolver: zodResolver(loginSchema),
   });

  const onSubmit = (data) => {
    console.log("Form Data : ", data);
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
            <button className="submit-btn" type="submit"> Login </button>
          </div>

        </form>
      </div>
    </>
  );
};

export default Login;
