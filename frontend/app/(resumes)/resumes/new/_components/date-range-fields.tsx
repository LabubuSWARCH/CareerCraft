"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface DateRangeFieldsProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  startName: FieldPath<TFieldValues>;
  endName: FieldPath<TFieldValues>;
  startLabel?: string;
  endLabel?: string;
  endOptional?: boolean;
}

const CALENDAR_START_YEAR = 1960;
const CALENDAR_END_YEAR_OFFSET = 10;
const NOW_VALUE = "Now";

export function DateRangeFields<TFieldValues extends FieldValues>({
  control,
  startName,
  endName,
  startLabel = "Start Date",
  endLabel = "End Date",
  endOptional = true,
}: DateRangeFieldsProps<TFieldValues>) {
  const [hasEndDate, setHasEndDate] = useState(false);

  const parseDate = (value: string | undefined) => {
    if (!value || value === NOW_VALUE) return undefined;
    return new Date(value);
  };

  const formatDateForStorage = (date: Date | undefined) => {
    return date ? format(date, "MMM yyyy") : "";
  };

  const handleEndDateToggle = (checked: boolean) => {
    setHasEndDate(checked);
    if (!checked) {
      control._formValues[endName] = NOW_VALUE;
    }
  };

  const renderDatePicker = (
    field: any,
    dateValue: Date | undefined,
    label: string
  ) => (
    <FormItem className="flex flex-col">
      <FormLabel>{label}</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              data-empty={!dateValue}
              className={cn(
                "w-full justify-start text-left font-normal",
                !dateValue && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateValue ? format(dateValue, "PPP") : <span>Pick a date</span>}
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            className="rounded-lg border shadow-sm"
            selected={dateValue}
            onSelect={(date) => field.onChange(formatDateForStorage(date))}
            captionLayout="dropdown"
            startMonth={new Date(CALENDAR_START_YEAR, 0, 1)}
            endMonth={
              new Date(
                new Date().getFullYear() + CALENDAR_END_YEAR_OFFSET,
                11,
                31
              )
            }
          />
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name={startName}
        render={({ field }) =>
          renderDatePicker(field, parseDate(field.value), startLabel)
        }
      />

      {endOptional && (
        <div className="flex items-center gap-2">
          <Switch checked={hasEndDate} onCheckedChange={handleEndDateToggle} />
          <Label
            className="cursor-pointer"
            onClick={() => handleEndDateToggle(!hasEndDate)}
          >
            Has end date
          </Label>
        </div>
      )}

      {(hasEndDate || !endOptional) && (
        <FormField
          control={control}
          name={endName}
          render={({ field }) =>
            renderDatePicker(field, parseDate(field.value), endLabel)
          }
        />
      )}

      {endOptional && !hasEndDate && (
        <p className="text-sm text-muted-foreground">
          Currently working here (Present)
        </p>
      )}
    </div>
  );
}
