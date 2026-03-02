import React, { useState } from "react";
import { Button, Input } from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { sendRegisterData } from "../services/register";

  // *************************************************************************

const schema = zod
  .object({
    name: zod
      .string()
      .nonempty("name is required")
      .min(3, "name must be at least 3 characters")
      .max(15, "name must be at max 15 characters"),
    username: zod
      .string()
      .nonempty("User name is required")
      .regex(
        /^[a-z0-9_]{3,30}$/,
        "Username must be 3-30 characters, lowercase letters, numbers, and underscores only (no spaces).",
      ),
    email: zod
      .string()
      .nonempty("email is required")
      .regex(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "invalid email",
      ),
    password: zod
      .string()
      .nonempty("New password is required")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
        "At least 8 characters with uppercase, lowercase, number, and special character.",
      ),
    rePassword: zod.string().nonempty("repassword is required"),
    dateOfBirth: zod.coerce.date("dateOfBirth is required").refine((value) => {
      const now = new Date().getFullYear();
      const birth = value.getFullYear();
      const diff = now - birth;
      return diff >= 18;
    }, "your age less than 18"),
    gender: zod.string().nonempty("gender is required"),
  })
  .refine((data) => data.password === data.rePassword, {
    path: ["rePassword"],
    message: "password and repassword don’t match",
  });

    // *************************************************************************

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

    // *************************************************************************

  const { handleSubmit, register, formState } = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
    resolver: zodResolver(schema),
  });

  // *************************************************************************

  async function signUp(values) {
    try {
      setLoading(true);
      const response = await sendRegisterData(values);

      if (response.success) {
        navigate("/login");
      } else {
        setApiError(response.message);
      }
    } catch (error) {
      console.log("🚀 ~ signUp ~ error:", error);
      setApiError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

    // *************************************************************************

  return (
    <div className="flex min min-h-screen justify-center items-center">
      <div className="w-md bg-white py-10 px-6 rounded-2xl shadow-2xl">
        <h2 className="mb-4 text-2xl">Register Page</h2>
        <form onSubmit={handleSubmit(signUp)} className="flex flex-col gap-4">
          <Input
            isInvalid={Boolean(formState.errors.name?.message)}
            errorMessage={formState.errors.name?.message}
            {...register("name")}
            label="Name"
            variant="bordered"
            labelPlacement="outside-top"
            placeholder="Enter your name"
            type="text"
            name="name"
          />
          <Input
            isInvalid={Boolean(formState.errors.name?.message)}
            errorMessage={formState.errors.name?.message}
            {...register("username")}
            label="User Name"
            variant="bordered"
            labelPlacement="outside-top"
            placeholder="Enter your username"
            type="text"
            name="username"
          />

          <Input
            {...register("email")}
            isInvalid={Boolean(formState.errors.email?.message)}
            errorMessage={formState.errors.email?.message}
            label="Email"
            variant="bordered"
            labelPlacement="outside-top"
            placeholder="Enter your email"
            type="email"
            name="email"
          />

          <Input
            {...register("password")}
            errorMessage={formState.errors.password?.message}
            isInvalid={Boolean(formState.errors.password?.message)}
            label="Password"
            variant="bordered"
            labelPlacement="outside-top"
            placeholder="Enter your password"
            type="password"
            name="password"
          />

          <Input
            {...register("rePassword")}
            errorMessage={formState.errors.rePassword?.message}
            isInvalid={Boolean(formState.errors.rePassword?.message)}
            label="Repassword"
            variant="bordered"
            labelPlacement="outside-top"
            placeholder="Enter your rePassword"
            type="password"
            name="rePassword"
          />

          <div className="flex space-x-2 ">
            <Input
              {...register("dateOfBirth")}
              errorMessage={formState.errors.dateOfBirth?.message}
              isInvalid={Boolean(formState.errors.dateOfBirth?.message)}
              label="dateOfBirth"
              variant="bordered"
              labelPlacement="outside-top"
              placeholder="Enter your date of birth"
              type="date"
              name="dateOfBirth"
            />

            <Select
              {...register("gender")}
              errorMessage={formState.errors.gender?.message}
              isInvalid={Boolean(formState.errors.gender?.message)}
              variant="bordered"
              labelPlacement="outside-top"
              label="Select your Gender"
              name="gender"
            >
              <SelectItem key={"male"}>male</SelectItem>
              <SelectItem key={"feMale"}>feMale</SelectItem>
            </Select>
          </div>
          {apiError && <p className="text-red-500 text-center">{apiError}</p>}
          <Button
            isLoading={loading}
            type="submit"
            className=""
            color="primary"
          >
            Register
          </Button>
          <p className="">
            if you have an account, please{" "}
            <Link className="text-blue-400" to={"/login"}>
              signIn
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
