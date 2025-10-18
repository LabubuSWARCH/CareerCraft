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

interface ExperienceFieldsProps {
  control: Control<ResumeFormData>;
  index: number;
  onRemove: () => void;
}

export function ExperienceFields({
  control,
  index,
  onRemove,
}: ExperienceFieldsProps) {
  const [showBullets, setShowBullets] = useState(false);

  const handleBulletsToggle = (checked: boolean) => {
    setShowBullets(checked);
    if (!checked) {
      control._formValues.experience[index].bullets = [];
    }
  };

  const convertTextToBullets = (text: string) => text.split("\n");
  const convertBulletsToText = (bullets: string[] | undefined) =>
    bullets?.join("\n") || "";

  return (
    <ArrayFieldItem title="Experience" index={index} onRemove={onRemove}>
      <FormField
        control={control}
        name={`experience.${index}.company`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company</FormLabel>
            <FormControl>
              <Input placeholder="Company Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`experience.${index}.role`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Role</FormLabel>
            <FormControl>
              <Input placeholder="Job Title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <DateRangeFields
        control={control}
        startName={`experience.${index}.start`}
        endName={`experience.${index}.end`}
      />

      <div className="flex items-center gap-2">
        <Switch checked={showBullets} onCheckedChange={handleBulletsToggle} />
        <Label
          className="cursor-pointer"
          onClick={() => handleBulletsToggle(!showBullets)}
        >
          Add bullet points (Optional)
        </Label>
      </div>

      {showBullets && (
        <FormField
          control={control}
          name={`experience.${index}.bullets`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bullet Points</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter each achievement on a new line"
                  className="min-h-[100px]"
                  value={convertBulletsToText(field.value)}
                  onChange={(e) =>
                    field.onChange(convertTextToBullets(e.target.value))
                  }
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
