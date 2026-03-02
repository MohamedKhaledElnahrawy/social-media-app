import React, { useState } from "react";
import { Button, Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { KeyRound } from "lucide-react";
import toast from "react-hot-toast"; 
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordApi } from "../services/changePassword";

  // *************************************************************************

const schema = zod
  .object({
    password: zod.string().nonempty("Current password is required"),
    newPassword: zod
      .string()
      .nonempty("New password is required")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
        "At least 8 characters with uppercase, lowercase, number, and special character.",
      ),
    confirmPassword: zod.string().nonempty("Confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "New password and confirmation don’t match",
  });

    // *************************************************************************


export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null); 

  const { handleSubmit, register, formState, reset } = useForm({
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
    resolver: zodResolver(schema),
  });

    // *************************************************************************

  async function updatePassword(values) {
    try {
      setLoading(true);
      setApiError(null);
      setApiSuccess(null);

      const dataToSend = {
        password: values.password,
        newPassword: values.newPassword,
      };

        // *************************************************************************

      const response = await changePasswordApi(dataToSend);

      if (
        response?.success === true ||
        response?.message === "password changed successfully"
      ) {
        setApiSuccess("Password updated! Logging you out for security...");
        toast.success("Success! Please login with your new password.");

        localStorage.removeItem("token");

        setTimeout(() => {
          window.location.href = "/login";
        }, 2500);

        reset();
      } else {
        let errorMessage = response?.message;

        if (errorMessage === "incorrect email or password") {
          errorMessage = "The current password you entered is incorrect.";
        } else if (!errorMessage) {
          errorMessage = "Check your password requirements.";
        }

        setApiError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.log("Error details:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");

        window.location.href = "/login";
      } else {
        setApiError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

    // *************************************************************************

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50/50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-slate-50 flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-full text-blue-600">
            <KeyRound size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Change Password
            </h2>
            <p className="text-slate-500 text-sm">
              Keep your account secure by using a strong password.
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(updatePassword)}
          className="p-8 flex flex-col gap-6"
        >
          <Input
            {...register("password")}
            isInvalid={Boolean(formState.errors.password)}
            errorMessage={formState.errors.password?.message}
            label="Current password"
            labelPlacement="outside"
            placeholder="Enter current password"
            variant="bordered"
            size="lg"
            type="password"
          />

          <Input
            {...register("newPassword")}
            isInvalid={Boolean(formState.errors.newPassword)}
            errorMessage={formState.errors.newPassword?.message}
            label="New password"
            labelPlacement="outside"
            placeholder="Enter new password"
            variant="bordered"
            size="lg"
            type="password"
            description="At least 8 characters with uppercase, lowercase, number, and special character."
          />

          <Input
            {...register("confirmPassword")}
            isInvalid={Boolean(formState.errors.confirmPassword)}
            errorMessage={formState.errors.confirmPassword?.message}
            label="Confirm new password"
            labelPlacement="outside"
            placeholder="Re-enter new password"
            variant="bordered"
            size="lg"
            type="password"
          />

          {apiError && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-center text-sm border border-red-100 font-medium">
              {apiError}
            </div>
          )}

          {apiSuccess && (
            <div className="p-3 bg-green-50 text-green-600 rounded-xl text-center text-sm border border-green-100 font-medium">
              {apiSuccess}
            </div>
          )}

          <Button
            isLoading={loading}
            type="submit"
            color="primary"
            size="lg"
            className="w-full rounded-xl font-bold shadow-lg shadow-blue-100 mt-4"
          >
            Update password
          </Button>
        </form>
      </div>
    </div>
  );
}
