"use client";

import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Menu as MenuIcon, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetFooter,
} from "../ui/sheet";
import Link from "next/link";
import { LINKS } from "./nav";

interface MenuProps {
  user:
    | {
        username: string;
        full_name: string;
        profile_picture?: string;
      }
    | null
    | undefined;
  onLogout: () => void;
}
export function MobileMenu({ user, onLogout }: MenuProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 py-4">
          {user ? (
            <div className="flex items-center gap-3 pb-4 border-b">
              <Avatar>
                <AvatarImage src={user.profile_picture} alt={user.full_name} />
                <AvatarFallback>
                  {user.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.full_name}</p>
                <p className="text-sm text-muted-foreground">{user.username}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 pb-4 border-b">
              <Avatar>
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Guest</p>
                <p className="text-sm text-muted-foreground">
                  Login to start creating resumes
                </p>
              </div>
            </div>
          )}
          {LINKS.map((link) => (
            <SheetClose asChild key={link.href}>
              <Button asChild variant="ghost" className="justify-start">
                <Link href={link.href}>{link.label}</Link>
              </Button>
            </SheetClose>
          ))}
        </div>
        <SheetFooter className="flex-col gap-2 sm:flex-col">
          {user ? (
            <SheetClose asChild>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={onLogout}
              >
                <LogOut />
                Log out
              </Button>
            </SheetClose>
          ) : (
            <SheetClose asChild>
              <Button asChild className="w-full">
                <Link href="/login">Login</Link>
              </Button>
            </SheetClose>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
