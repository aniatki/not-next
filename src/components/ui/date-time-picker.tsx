"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface Calendar24Props {
  date: Date | undefined;
  time: string | undefined;
  onDateChange: (date: Date) => void;
  onTimeChange: (time: string) => void;
}

export function Calendar24({ date, onDateChange, onTimeChange }: Calendar24Props) {
  const [open, setOpen] = React.useState(false);
  const [selectedTime, setSelectedTime] = React.useState<string>("09:00");

  const handleDateSelect = (date: Date) => {
    onDateChange(date);
    setOpen(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
    onTimeChange(e.target.value);
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Label htmlFor="bookingDate" className="px-1 text-muted-foreground">
          Booking Date
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="w-32 justify-between font-normal"
            >
              {date ? date.toDateString().slice(4, 15) : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              required
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(newDate) => {
                if (newDate) {
                  handleDateSelect(newDate);
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="bookingTime" className="px-1 text-muted-foreground">
          Time
        </Label>
        <Input
          type="time"
          id="bookingTime"
          name="bookingTime"
          step="1"
          defaultValue={selectedTime}
          onChange={handleTimeChange}
          className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}