"use client";

import { useSearchParams, useRouter } from "next/navigation";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { LogIn, X } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useForm } from "react-hook-form";
import { resetPasswordDataSchema } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUser } from "@/providers/user-provider";
import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const SUCCESS_DISPLAY_TIME = 5;
const ERROR_DISPLAY_TIME = 5;

const textTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 },
};

const iconTransition = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.5 },
  transition: { duration: 0.3 },
};

const resetPasswordFormSchema = resetPasswordDataSchema
  .extend({
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const { resetPassword: resetPasswordMutation } = useUser();
  const [showSuccess, setShowSuccess] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState(0);
  const [showError, setShowError] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      token: token ?? "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPasswordMutation.mutateAsync({
        token: data.token,
        newPassword: data.newPassword,
      });

      setShowSuccess(true);
      setRedirectTimer(SUCCESS_DISPLAY_TIME);
      const interval = setInterval(() => {
        setRedirectTimer((t) => {
          if (t === 1) {
            clearInterval(interval);
            setShowSuccess(false);
            router.push("/login");
          }
          return t - 1;
        });
      }, 1000);
    } catch (error) {
      setShowError(true);

      setTimeout(() => {
        setShowError(false);
      }, ERROR_DISPLAY_TIME * 1000);

      form.setError("root", {
        message:
          "Failed to reset password. The link may be invalid or expired.",
      });
    }
  };

  if (!token) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <X />
          </EmptyMedia>
          <EmptyTitle>Invalid Reset Password Page</EmptyTitle>
          <EmptyDescription>
            This password reset link is invalid. Please request a new one.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/forgot-password">Request New Reset Link</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/login">Back to Login</Link>
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <main className="container mx-auto flex flex-col items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Enter your new password below to reset your account password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="newPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Your new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <motion.div
            className="w-full"
            animate={{
              scale: showSuccess || showError ? [1, 1.02, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <Button
              className={cn(
                "w-full relative overflow-hidden",
                showSuccess && "bg-green-600",
                showError && "bg-red-600"
              )}
              type="submit"
              disabled={
                resetPasswordMutation.isPending || showSuccess || showError
              }
              onClick={form.handleSubmit(onSubmit)}
            >
              <AnimatePresence mode="wait">
                {resetPasswordMutation.isPending ? (
                  <motion.div
                    key="resetting"
                    {...textTransition}
                    className="flex items-center gap-2"
                  >
                    <Spinner /> Resetting password...
                  </motion.div>
                ) : showSuccess ? (
                  <motion.div
                    key="success"
                    {...iconTransition}
                    className="flex items-center gap-2"
                  >
                    <Check className="size-5" />
                    Password Reset Successfully!
                  </motion.div>
                ) : showError ? (
                  <motion.div
                    key="error"
                    {...iconTransition}
                    className="flex items-center gap-2"
                  >
                    <AlertCircle className="size-5" />
                    Reset Failed!
                  </motion.div>
                ) : (
                  <motion.div key="ready" {...textTransition}>
                    Submit
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
          <Button asChild variant="link">
            <Link href="/login" className="text-sm">
              <AnimatePresence mode="wait">
                {showSuccess && redirectTimer < SUCCESS_DISPLAY_TIME - 1 ? (
                  <motion.div
                    key="redirecting"
                    {...textTransition}
                    className="flex items-center gap-2"
                  >
                    <Spinner />
                    Redirecting in {redirectTimer}{" "}
                    {redirectTimer === 1 ? "second" : "seconds"}...
                  </motion.div>
                ) : (
                  <motion.div
                    key="back-to-login"
                    {...textTransition}
                    className="flex items-center gap-2"
                  >
                    <LogIn className="size-4" />
                    Back to Login
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          </Button>
          {form.formState.errors.root ? (
            <p className="text-[0.8rem] font-medium text-destructive">
              {form.formState.errors.root.message}
            </p>
          ) : null}
        </CardFooter>
      </Card>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="container mx-auto flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Reset Password</CardTitle>
              <CardDescription>Loading...</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8">
              <Spinner />
            </CardContent>
          </Card>
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
