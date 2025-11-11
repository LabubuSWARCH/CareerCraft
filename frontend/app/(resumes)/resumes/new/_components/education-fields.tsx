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
import { DateRangeFields } from "./date-range-fields";
import { useState, useEffect } from "react";

interface EducationFieldsProps {
  control: Control<ResumeFormData>;
  index: number;
  onRemove: () => void;
}

export function EducationFields({
  control,
  index,
  onRemove,
}: EducationFieldsProps) {
  const details = useWatch({
    control,
    name: `education.${index}.details`,
  });

  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (details && details.length > 0) {
      setShowDetails(true);
    }
  }, []);

  const handleDetailsToggle = (checked: boolean) => {
    setShowDetails(checked);
  };

  return (
    <ArrayFieldItem title="Education" index={index} onRemove={onRemove}>
      <FormField
        control={control}
        name={`education.${index}.school`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>School</FormLabel>
            <FormControl>
              <Input placeholder="University Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`education.${index}.degree`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Degree</FormLabel>
            <FormControl>
              <Input
                placeholder="Bachelor of Science in Computer Science"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <DateRangeFields
        control={control}
        startName={`education.${index}.start`}
        endName={`education.${index}.end`}
      />

      <FormField
        control={control}
        name={`education.${index}.details`}
        render={({ field }) => (
          <>
            <div className="flex items-center gap-2">
              <Switch
                checked={showDetails}
                onCheckedChange={(checked) => handleDetailsToggle(checked)}
              />
              <Label
                className="cursor-pointer"
                onClick={() => handleDetailsToggle(!showDetails)}
              >
                Add details (Optional)
              </Label>
            </div>

            {showDetails && (
              <FormItem>
                <FormLabel>Details</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="GPA, honors, relevant coursework, etc."
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
