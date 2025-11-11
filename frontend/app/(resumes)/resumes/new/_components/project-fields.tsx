"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Control, useWatch } from "react-hook-form";
import { ResumeFormData } from "../_schema";
import { ArrayFieldItem } from "./array-field-item";
import { useState, useEffect } from "react";

interface ProjectFieldsProps {
  control: Control<ResumeFormData>;
  index: number;
  onRemove: () => void;
}

export function ProjectFields({
  control,
  index,
  onRemove,
}: ProjectFieldsProps) {
  const link = useWatch({
    control,
    name: `projects.${index}.link`,
  });

  const [showLink, setShowLink] = useState(false);

  useEffect(() => {
    if (link && link.length > 0) {
      setShowLink(true);
    }
  }, []);

  const handleLinkToggle = (checked: boolean) => {
    setShowLink(checked);
  };

  return (
    <ArrayFieldItem title="Project" index={index} onRemove={onRemove}>
      <FormField
        control={control}
        name={`projects.${index}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Project Name</FormLabel>
            <FormControl>
              <Input placeholder="My Awesome Project" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`projects.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Brief description of the project..."
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`projects.${index}.link`}
        render={({ field }) => (
          <>
            <div className="flex items-center gap-2">
              <Switch
                checked={showLink}
                onCheckedChange={(checked) => handleLinkToggle(checked)}
              />
              <Label
                className="cursor-pointer"
                onClick={() => handleLinkToggle(!showLink)}
              >
                Add link (Optional)
              </Label>
            </div>

            {showLink && (
              <FormItem>
                <FormLabel>Link</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://github.com/username/project"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          </>
        )}
      />
    </ArrayFieldItem>
  );
}
