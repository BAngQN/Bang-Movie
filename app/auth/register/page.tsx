"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface RegisterFormValues {
    displayName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export default function RegisterPage() {
    const router = useRouter();
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>();

    const onSubmit = async (data: RegisterFormValues) => {
        setServerError("");
        try {
            const { user } = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password,
            );
            if (data.displayName.trim()) {
                await updateProfile(user, {
                    displayName: data.displayName.trim(),
                });
            }
            router.push("/");
        } catch (err: unknown) {
            const code = (err as { code?: string }).code ?? "";
            if (code === "auth/email-already-in-use") {
                setServerError("This email is already registered.");
            } else if (code === "auth/invalid-email") {
                setServerError("Invalid email address.");
            } else {
                setServerError("Registration failed. Please try again.");
            }
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="rounded-2xl border border-gray-800 bg-[#1a1a2e] px-8 py-10 shadow-2xl">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-white">
                            Create Account
                        </h1>
                        <p className="mt-2 text-sm text-gray-400">
                            Join Bang Movie and start exploring
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-5"
                        noValidate
                    >
                        {/* Username */}
                        <div>
                            <label
                                htmlFor="displayName"
                                className="mb-1.5 block text-sm font-medium text-gray-300"
                            >
                                Username
                            </label>
                            <input
                                id="displayName"
                                type="text"
                                autoComplete="username"
                                placeholder="John Doe"
                                {...register("displayName")}
                                className="w-full rounded-lg border border-gray-700 bg-[#0f0f1a] px-4 py-2.5 text-sm text-white placeholder-gray-500 transition focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1.5 block text-sm font-medium text-gray-300"
                            >
                                Email <span className="text-red-400">*</span>
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                {...register("email", {
                                    required: "Email is required.",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Enter a valid email address.",
                                    },
                                })}
                                className={`w-full rounded-lg border bg-[#0f0f1a] px-4 py-2.5 text-sm text-white placeholder-gray-500 transition focus:outline-none ${
                                    errors.email
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-gray-700 focus:border-blue-500"
                                }`}
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-400">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1.5 block text-sm font-medium text-gray-300"
                            >
                                Password <span className="text-red-400">*</span>
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Min. 6 characters"
                                {...register("password", {
                                    required: "Password is required.",
                                    minLength: {
                                        value: 6,
                                        message:
                                            "Password must be at least 6 characters.",
                                    },
                                })}
                                className={`w-full rounded-lg border bg-[#0f0f1a] px-4 py-2.5 text-sm text-white placeholder-gray-500 transition focus:outline-none ${
                                    errors.password
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-gray-700 focus:border-blue-500"
                                }`}
                            />
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-400">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="mb-1.5 block text-sm font-medium text-gray-300"
                            >
                                Confirm Password{" "}
                                <span className="text-red-400">*</span>
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                placeholder="Repeat your password"
                                {...register("confirmPassword", {
                                    required: "Please confirm your password.",
                                    validate: (value) =>
                                        value === getValues("password") ||
                                        "Passwords do not match.",
                                })}
                                className={`w-full rounded-lg border bg-[#0f0f1a] px-4 py-2.5 text-sm text-white placeholder-gray-500 transition focus:outline-none ${
                                    errors.confirmPassword
                                        ? "border-red-500 focus:border-red-500"
                                        : "border-gray-700 focus:border-blue-500"
                                }`}
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-xs text-red-400">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Server error */}
                        {serverError && (
                            <p className="rounded-lg bg-red-900/40 px-4 py-2.5 text-sm text-red-400">
                                {serverError}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting
                                ? "Creating account…"
                                : "Create Account"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-400">
                        Already have an account?{" "}
                        <Link
                            href="/auth/login"
                            className="font-medium text-blue-400 hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
