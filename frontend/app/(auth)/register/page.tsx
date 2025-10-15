"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@/providers/user-provider";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { RegisterData, registerDataSchema } from "@/types/user";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const SUCCESS_DISPLAY_TIME = 1;
const ERROR_DISPLAY_TIME = 1;

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

export default function RegisterPage() {
  const { register: registerMutation } = useUser();
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const form = useForm<RegisterData>({
    resolver: zodResolver(registerDataSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      full_name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  const onSubmit = async (data: RegisterData) => {
    try {
      await registerMutation.mutateAsync(data);

      setShowSuccess(true);

      setTimeout(() => {
        router.push("/");
      }, SUCCESS_DISPLAY_TIME * 1000);
    } catch (error) {
      setShowError(true);

      setTimeout(() => {
        setShowError(false);
      }, ERROR_DISPLAY_TIME * 1000);

      form.setError("root", {
        message: (error as Error).message,
      });
    }
  };

  return (
    <main className="container mx-auto flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your information to create a new account.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username *</FormLabel>
                    <FormControl>
                      <Input placeholder="jane.doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password *</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Your password"
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
                    <FormLabel>Confirm Password *</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="full_name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="jane.doe@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="phone"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 234 567 8900" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="address"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Main St, City, Country"
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
              disabled={registerMutation.isPending || showSuccess || showError}
              onClick={form.handleSubmit(onSubmit)}
            >
              <AnimatePresence mode="wait">
                {registerMutation.isPending ? (
                  <motion.div
                    key="registering"
                    {...textTransition}
                    className="flex items-center gap-2"
                  >
                    <Spinner /> Creating account...
                  </motion.div>
                ) : showSuccess ? (
                  <motion.div
                    key="success"
                    {...iconTransition}
                    className="flex items-center gap-2"
                  >
                    <Check className="size-5" />
                    Account Created!
                  </motion.div>
                ) : showError ? (
                  <motion.div
                    key="error"
                    {...iconTransition}
                    className="flex items-center gap-2"
                  >
                    <AlertCircle className="size-5" />
                    Registration Failed!
                  </motion.div>
                ) : (
                  <motion.div key="ready" {...textTransition}>
                    Register
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
          <Button
            asChild
            variant="link"
            className="w-full hover:no-underline group"
          >
            <Link href="/login">
              Already have an account?{" "}
              <span className="underline text-secondary-foreground group-hover:no-underline">
                Login here
              </span>
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
