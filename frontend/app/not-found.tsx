import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <X />
        </EmptyMedia>
        <EmptyTitle>404 - Page Not Found</EmptyTitle>
        <EmptyDescription>
          The page you are looking for does not exist or has been moved.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild size="lg">
          <Link href="/">Go to Home</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
