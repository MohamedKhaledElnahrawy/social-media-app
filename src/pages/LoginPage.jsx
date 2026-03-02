import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { sendLoginData } from "../services/login";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/context/AuthContext";

const schema = zod.object({
  email: zod
    .string()
    .nonempty("email is required")
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "invalid email"),
  password: zod
    .string()
    .nonempty("New password is required")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
      "At least 8 characters with uppercase, lowercase, number, and special character.",
    ),
});

  // ************************************************************************************

export default function LoginPage() {
  const [apiError, setApiError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setIsLogedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const { handleSubmit, register, formState } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

    // ************************************************************************************

  async function signIn(values) {
    try {
      setLoading(true);
      const response = await sendLoginData(values);

      if (response.success) {
        localStorage.setItem("token", response.data.token);

        setIsLogedIn(true);

        navigate("/home");
      } else {
        setApiError(true); 
      }
    } catch (error) {
      console.log("Login Error:", error);
      setApiError(true);
    } finally {
      setLoading(false);
    }
  }

  // ************************************************************************************
  
  return (
    <div className=" min-h-screen  flex justify-center items-center">
      <div className="w-md  bg-white  py-10 px-6 rounded-2xl shadow-2xl ">
        <h1 className="mb-4 text-2xl">Login Page</h1>
        <form
          onSubmit={handleSubmit(signIn)}
          className="w-full flex flex-col gap-4"
        >
          <Input
            {...register("email")}
            isInvalid={Boolean(formState.errors.email?.message)}
            errorMessage={formState.errors.email?.message}
            label="Email"
            labelPlacement="outside-top"
            placeholder="Enter your email"
            type="email"
          />
          <Input
            {...register("password")}
            isInvalid={Boolean(formState.errors.password?.message)}
            errorMessage={formState.errors.password?.message}
            label="password"
            labelPlacement="outside-top"
            placeholder="Enter your password"
            type="password"
          />
          {apiError && (
            <p className="text-red-500 text-center">
              incorrect email or password
            </p>
          )}
          <Button
            isLoading={loading}
            type="submit"
            varient="bordered"
            color="primary"
          >
            signIn
          </Button>
          <p>
            if you haven’t an account, please{" "}
            <Link className="text-blue-400" to={"/register"}>
              signUp
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
