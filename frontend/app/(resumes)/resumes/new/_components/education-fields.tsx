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
import { Control } from "react-hook-form";
import { ResumeFormData } from "../_schema";
import { ArrayFieldItem } from "./array-field-item";
import { DateRangeFields } from "./date-range-fields";
import { useState } from "react";

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
  const [showDetails, setShowDetails] = useState(false);

  const handleDetailsToggle = (checked: boolean) => {
    setShowDetails(checked);
    if (!checked) {
      control._formValues.education[index].details = "";
    }
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

      <div className="flex items-center gap-2">
        <Switch checked={showDetails} onCheckedChange={handleDetailsToggle} />
        <Label
          className="cursor-pointer"
          onClick={() => handleDetailsToggle(!showDetails)}
        >
          Add details (Optional)
        </Label>
      </div>

      {showDetails && (
        <FormField
          control={control}
          name={`education.${index}.details`}
          render={({ field }) => (
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
        />
      )}
    </ArrayFieldItem>
  );
}
