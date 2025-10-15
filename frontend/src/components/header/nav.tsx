"use client";

import Link from "next/link";
import DropdownMenu from "./desktop-menu";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useUser } from "@/providers/user-provider";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Spinner } from "../ui/spinner";
import { MobileMenu } from "./mobile-menu";

export const LINKS = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Templates",
    href: "/templates",
  },
  {
    label: "Resumes",
    href: "/resumes",
  },
];

export default function Nav() {
  const isMobile = useMediaQuery("(max-width: 768px)");

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

  if (isMobile) {
    return <MobileMenu user={profileQuery.data} onLogout={logout} />;
  }

  return (
    <nav className="flex items-center justify-between">
      {LINKS.map((link) => (
        <Button asChild variant="ghost" key={link.href}>
          <Link href={link.href}>{link.label}</Link>
        </Button>
      ))}
      <DropdownMenu user={profileQuery.data} onLogout={logout} />
    </nav>
  );
}
