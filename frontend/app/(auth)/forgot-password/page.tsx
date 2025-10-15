"use client";

import { Button } from "@/components/ui/button";
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
import { useUser } from "@/providers/user-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ForgotPasswordData, forgotPasswordDataSchema } from "@/types/user";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, AlertCircle, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const WAIT_TIME = 60;
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

export default function ForgotPasswordPage() {
  const { forgotPassword: forgotPasswordMutation } = useUser();
  const [timer, setTimer] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordDataSchema),
    defaultValues: {
      identifier: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    try {
      await forgotPasswordMutation.mutateAsync(data);

      setShowSuccess(true);
      setTimer(WAIT_TIME);

      const interval = setInterval(() => {
        setTimer((t) => {
          if (t === 1) {
            clearInterval(interval);
          }
          return t - 1;
        });
      }, 1000);

      setTimeout(() => {
        setShowSuccess(false);
      }, SUCCESS_DISPLAY_TIME * 1000);
    } catch (error) {
      setShowError(true);

      setTimeout(() => {
        setShowError(false);
      }, ERROR_DISPLAY_TIME * 1000);

      form.setError("root", {
        message: "Failed to send. Check the username and try again.",
      });
    }
  };

  return (
    <main className="container mx-auto flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your username or email to receive a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username/Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john.watson@example.com" {...field} />
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
                forgotPasswordMutation.isPending ||
                timer > 0 ||
                showSuccess ||
                showError
              }
              onClick={form.handleSubmit(onSubmit)}
            >
              <AnimatePresence mode="wait">
                {forgotPasswordMutation.isPending ? (
                  <motion.div
                    key="sending"
                    {...textTransition}
                    className="flex items-center gap-2"
                  >
                    <Spinner /> Sending...
                  </motion.div>
                ) : showSuccess ? (
                  <motion.div
                    key="success"
                    {...iconTransition}
                    className="flex items-center gap-2"
                  >
                    <Check className="size-5" />
                    Email Sent!
                  </motion.div>
                ) : showError ? (
                  <motion.div
                    key="error"
                    {...iconTransition}
                    className="flex items-center gap-2"
                  >
                    <AlertCircle className="size-5" />
                    Failed to Send
                  </motion.div>
                ) : timer > 0 ? (
                  <motion.div key="timer" {...textTransition}>
                    {`You can try again in ${timer}${
                      timer === 1 ? " second" : " seconds"
                    }`}
                  </motion.div>
                ) : (
                  <motion.div key="ready" {...textTransition}>
                    Send Reset Password Link
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
          <Button asChild variant="link">
            <Link href="/login" className="text-sm">
              <LogIn />
              Back to Login
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
