import Link from "next/link";
import Nav from "./nav";

export default function Header() {
  return (
    <header className="flex border-b">
      <div className="container mx-auto px-8 flex justify-between items-center p-4">
        <Link href="/">
          <h1 className="text-2xl font-bold text-primary">CareerCraft</h1>
        </Link>
        <Nav />
      </div>
    </header>
  );
}
