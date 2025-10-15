"use client";

import { useUser } from "@/providers/user-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Spinner } from "../ui/spinner";
import { LogOut } from "lucide-react";

export default function Menu() {
  const { profile: profileQuery, logout: logoutMutation } = useUser();

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  if (profileQuery.isPending) {
    return (
      <Avatar>
        <AvatarFallback>
          <Spinner />
        </AvatarFallback>
      </Avatar>
    );
  }

  if (!profileQuery.data)
    return (
      <Button asChild>
        <Link href="/login">Login</Link>
      </Button>
    );

  const {
    data: { username, full_name, profile_picture },
  } = profileQuery;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src={profile_picture} alt={username} />
          <AvatarFallback>
            {full_name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
