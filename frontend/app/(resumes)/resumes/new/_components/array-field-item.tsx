import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { ReactNode } from "react";

interface ArrayFieldItemProps {
  title: string;
  index: number;
  onRemove: () => void;
  children: ReactNode;
}

export function ArrayFieldItem({
  title,
  index,
  onRemove,
  children,
}: ArrayFieldItemProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">
          {title} {index + 1}
        </CardTitle>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}
