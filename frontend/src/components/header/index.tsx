import Link from "next/link";
import Menu from "./menu";
import { Button } from "@/components/ui/button";

const LINKS = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Resumes",
    href: "/resumes",
  },
];

export default function Header() {
  return (
    <header className="flex border-b">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold text-primary">CareerCraft</h1>
        <nav className="flex items-center justify-between">
          {LINKS.map((link) => (
            <Button asChild variant="ghost" key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
          <Menu />
        </nav>
      </div>
    </header>
  );
}
