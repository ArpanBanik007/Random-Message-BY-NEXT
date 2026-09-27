"use client";

import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useDebounceValue } from "usehooks-ts";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

import { signupSchema } from "@/src/schemas/signupSchema";
import { ApiResponse } from "@/src/types/ApiResponse";

import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Page() {
  const [username, setUsername] = React.useState("");
  const [usernameMsg, setUsernameMsg] = React.useState("");
  const [isCheckingUsername, setIsCheckingUsername] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [debouncedUsername] = useDebounceValue(username, 300);
  const router = useRouter();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUserNameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMsg("");

        try {
          const res = await axios.get<ApiResponse>(
            `/api/checkUsernameUnique?username=${debouncedUsername}`
          );
          setUsernameMsg(res.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMsg(
            axiosError.response?.data.message || "Error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };

    checkUserNameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);

    try {
      const res = await axios.post<ApiResponse>("/api/sign-up", data);

      toast.add({
        title: "Success",
        description: res.data.message,
      });

      router.replace(`/verify/${username}`);
    } catch (error) {
      console.log("Error in sign up user", error);

      const axiosError = error as AxiosError<ApiResponse>;
      const errorMsg =
        axiosError.response?.data.message ?? "Something went wrong";

      toast.add({
        title: "Signup Failed",
        description: errorMsg,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight lg:text-5xl mb-6">
            Join Mystery Message
          </h1>

          <p className="mb-4  text-slate-600">Sign up to start your anonymous adventure</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            control={form.control}
            name="username"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                className=" text-slate-700"
                htmlFor={field.name}>Username</FieldLabel>

                <Input
                  {...field}
                  id={field.name}
                  placeholder="Abhi....."
                  aria-invalid={fieldState.invalid}
                  onChange={(e) => {
                    field.onChange(e);
                    setUsername(e.target.value);
                  }}
                />

                <FieldDescription>
                  This is your public display name.
                </FieldDescription>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}

                {!fieldState.invalid && isCheckingUsername && (
                  <p className="text-sm text-muted-foreground">
                    Checking username...
                  </p>
                )}

                {!fieldState.invalid && !isCheckingUsername && usernameMsg && (
                  <p
                    className={`text-sm ${
                      usernameMsg.toLowerCase().includes("unique") ||
                      usernameMsg.toLowerCase().includes("available")
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {usernameMsg}
                  </p>
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel 
                className=" text-slate-700"
                htmlFor={field.name}>Email</FieldLabel>

                <Input
                  {...field}
                  id={field.name}
                  type="email"
                  placeholder="you@example.com"
                  aria-invalid={fieldState.invalid}
                />

                <FieldDescription>
                  We will send you a verification code.
                </FieldDescription>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                className=" text-slate-700"
                htmlFor={field.name}>Password</FieldLabel>

                <Input
                  {...field}
                  id={field.name}
                  type="password"
                  aria-invalid={fieldState.invalid}
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </Button>
        </form>

        <div className="text-center mt-4">
          <p className=" text-slate-900">
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Page;