"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa";
import { FiAlertOctagon } from "react-icons/fi";
import { z } from "zod";
import Input from "./Input";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createPortfolio } from "@/data/db";

const SignUpView = () => {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const formSchema = z
    .object({
      name: z.string().min(1, { message: "Name is required" }),
      email: z.email(),
      password: z.string().min(1, { message: "Password is required" }),
      confirmPassword: z.string().min(1, { message: "Password is required" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setError(null);
    setPending(true);
    authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        callbackURL: "/",
      },
      {
        onSuccess: (context) => {
          console.log("this is context", context);
          setPending(false);
          router.push("/");
        },
        onError: (error) => {
          setError(error.error.message);
        },
      }
    );
  };

  const onSocial = async () => {
    await authClient.signIn.social(
      {
        provider: "google",
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          setPending(false);
        },
        onError: (error) => {
          setError(error.error.message);
        },
      }
    );
  };

  return (
    <div className="bg-[#262626] text-white p-8 rounded-lg">
      <div className="flex flex-col items-center justify-center">
        <Image
          src="/cLogo.png"
          alt="Coinfolio logo"
          width={150}
          height={100}
          className=""
        />
        <h1 className="text-xl font-bold">Welcome</h1>
      </div>
      <div className="mt-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Input
            type="name"
            label="Name"
            placeholder="John Doe"
            id="name"
            register={register("name")}
            error={errors.name}
          />
          <Input
            type="email"
            label="Email"
            placeholder="a@example.com"
            id="email"
            register={register("email")}
            error={errors.email}
          />

          <Input
            type="password"
            label="Password"
            placeholder="********"
            id="password"
            register={register("password")}
            error={errors.password}
          />
          <Input
            type="password"
            label="Confirm Password"
            placeholder="********"
            id="confirmPassword"
            register={register("confirmPassword")}
            error={errors.confirmPassword}
          />
          {error && (
            //server error
            <div className="flex items-center gap-2 text-rose-400">
              <FiAlertOctagon />
              <p>{error}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={pending}
            className={`w-full bg-black py-2 px-3 rounded-md hover:bg-neutral-900 hover:cursor-pointer`}
          >
            Sign Up
          </button>
          <div className="flex items-center text-neutral-400">
            <div className="border-t border-neutral-400 flex-1 "></div>
            <span className="mx-2">Or continue with</span>
            <div className="border-t border-neutral-400 flex-1"></div>
          </div>
          <div>
            <button
              onClick={() => onSocial()}
              className="hover:bg-black hover:cursor-pointer hover:border-0 flex items-center justify-center gap-4 border-[1px] border-neutral-400 py-2 px-3 w-full rounded-md"
            >
              <FaGoogle />
              Continue with Google
            </button>
          </div>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="underline underline-offset-4 hover:text-black"
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SignUpView;
