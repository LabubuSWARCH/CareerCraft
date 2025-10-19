"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@/providers/user-provider";
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
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
  Dropzone,
  DropzoneEmptyState,
  DropzoneContent,
} from "@/components/ui/dropzone";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Profile, profileSchema } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import { Check, AlertCircle } from "lucide-react";

const SUCCESS_DISPLAY_TIME = 5;
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

export default function ProfilePage() {
  const { profile } = useUser();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [avatarFiles, setAvatarFiles] = useState<File[]>([]);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>();
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const form = useForm<
    Pick<Profile, "full_name" | "address" | "email" | "phone">
  >({
    resolver: zodResolver(
      profileSchema.pick({
        full_name: true,
        address: true,
        email: true,
        phone: true,
      })
    ),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    if (profile.data) {
      form.reset({
        full_name: profile.data.full_name || "",
        email: profile.data.email || "",
        phone: profile.data.phone || "",
        address: profile.data.address || "",
      });
      if (profile.data.profile_picture) {
        setAvatarPreview(profile.data.profile_picture);
      }
    }
  }, [profile.data, form]);

  const handleDrop = (files: File[]) => {
    setAvatarFiles(files);
    setAvatarError(null);
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === "string") {
          setAvatarPreview(e.target?.result);
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationKey: ["update-profile"],
    mutationFn: async (
      data: Pick<
        Profile,
        "full_name" | "address" | "email" | "phone" | "profile_picture"
      >
    ) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const onSubmit = async (
    data: Pick<
      Profile,
      "full_name" | "address" | "email" | "phone" | "profile_picture"
    >
  ) => {
    try {
      await updateProfile.mutateAsync({
        ...data,
        profile_picture: avatarPreview,
      });

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
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
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Update your profile information below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label className={cn(avatarError && "text-destructive")}>
                  Profile Picture
                </Label>
                <Dropzone
                  accept={{ "image/*": [".png", ".jpg", ".jpeg"] }}
                  onDrop={handleDrop}
                  onError={(e) => {
                    setAvatarFiles([]);
                    setAvatarError(e.message);
                  }}
                  src={avatarFiles}
                  className="size-32 rounded-full mx-auto p-0"
                  maxSize={5 * 1024 * 1024} // 5MB
                >
                  <DropzoneEmptyState />
                  <DropzoneContent>
                    {avatarPreview ? (
                      <div className="size-full relative hover:opacity-75 transition-opacity">
                        <Image
                          alt="Preview"
                          className="absolute top-0 left-0 h-full w-full object-cover"
                          src={avatarPreview}
                          fill
                        />
                      </div>
                    ) : null}
                  </DropzoneContent>
                </Dropzone>
                {avatarError ? (
                  <p className="text-[0.8rem] font-medium text-destructive">
                    {avatarError}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label>Username </Label>
                <Input disabled value={profile.data?.username} />
              </div>
              <FormField
                name="full_name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name </FormLabel>
                    <FormControl>
                      <Input placeholder="John Watson" {...field} />
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
                    <FormLabel>Email </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.watson@example.com"
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
                    <FormLabel>Phone </FormLabel>
                    <FormControl>
                      <Input placeholder="01 2345 6789" {...field} />
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
                    <FormLabel>Address </FormLabel>
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
              disabled={
                updateProfile.isPending ||
                showSuccess ||
                showError ||
                (!form.formState.isDirty && avatarFiles.length === 0)
              }
              onClick={form.handleSubmit(onSubmit, console.error)}
            >
              <AnimatePresence mode="wait">
                {updateProfile.isPending ? (
                  <motion.div
                    key="profileing"
                    {...textTransition}
                    className="flex items-center gap-2"
                  >
                    <Spinner /> Updating Profile
                  </motion.div>
                ) : showSuccess ? (
                  <motion.div
                    key="success"
                    {...iconTransition}
                    className="flex items-center gap-2"
                  >
                    <Check className="size-5" />
                    Profile Updated!
                  </motion.div>
                ) : showError ? (
                  <motion.div
                    key="error"
                    {...iconTransition}
                    className="flex items-center gap-2"
                  >
                    <AlertCircle className="size-5" />
                    Error Updating Profile
                  </motion.div>
                ) : (
                  <motion.div key="ready" {...textTransition}>
                    Save Profile
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
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
