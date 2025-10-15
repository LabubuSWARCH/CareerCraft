"use client";

import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { createContext, type ReactNode, useContext } from "react";
import type {
  Profile,
  LoginData,
  ForgotPasswordData,
  ResetPasswordData,
  RegisterData,
} from "@/types/user";

interface UserContextType {
  profile: UseQueryResult<Profile | null, Error>;
  login: UseMutationResult<void, Error, LoginData, unknown>;
  register: UseMutationResult<void, Error, RegisterData, unknown>;
  logout: UseMutationResult<void, Error, void, unknown>;
  forgotPassword: UseMutationResult<void, Error, ForgotPasswordData, unknown>;
  resetPassword: UseMutationResult<void, Error, ResetPasswordData, unknown>;
}

export const UserContext = createContext<UserContextType>({
  profile: {} as UseQueryResult<Profile | null, Error>,
  login: {} as UseMutationResult<void, Error, LoginData, unknown>,
  register: {} as UseMutationResult<void, Error, RegisterData, unknown>,
  logout: {} as UseMutationResult<void, Error, void, unknown>,
  forgotPassword: {} as UseMutationResult<
    void,
    Error,
    ForgotPasswordData,
    unknown
  >,
  resetPassword: {} as UseMutationResult<
    void,
    Error,
    ResetPasswordData,
    unknown
  >,
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  const profile = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/profile`,
        {
          credentials: "include",
        }
      );
      if (res.ok) {
        return res.json();
      }
      return null;
    },
  });

  const login = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
          credentials: "include",
        }
      );
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Invalid username or password");
        }
        if (res.status === 500) {
          throw new Error("Server error. Please try again later.");
        }
        throw new Error("Something went wrong. Please try again.");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!res.ok) {
        throw new Error("Logout failed");
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
    },
  });

  const forgotPassword = useMutation({
    mutationFn: async ({ identifier }: ForgotPasswordData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/forgot`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ identifier }),
        }
      );
      if (!res.ok) {
        throw new Error("Forgot password request failed");
      }
    },
  });

  const resetPassword = useMutation({
    mutationFn: async ({ token, newPassword }: ResetPasswordData) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/reset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, newPassword }),
        }
      );
      if (!res.ok) {
        throw new Error("Reset password failed");
      }
    },
  });

  const register = useMutation({
    mutationFn: async (data: RegisterData) => {
      const { confirmPassword, ...registerData } = data;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registerData),
          credentials: "include",
        }
      );
      if (!res.ok) {
        if (res.status === 409) {
          throw new Error("Username already exists");
        }
        if (res.status === 500) {
          throw new Error("Server error. Please try again later.");
        }
        throw new Error("Registration failed. Please try again.");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  return (
    <UserContext.Provider
      value={{
        profile,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
