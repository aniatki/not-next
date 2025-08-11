import { createBooking } from "@/app/actions/actions";
import SubmitButton from "./SubmitButton";
import { Calendar24 } from "./ui/date-time-picker";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";
import { useActionState } from "react";
import { InitialState } from "@/app/types/types";
import { toast } from "sonner"

export default function BookingForm() {

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("09:00");

  const initialState: InitialState = {
    success: false,
    error: null,
    id: null
  };

  const [formState, formAction] = useActionState<InitialState, FormData>(createBooking, initialState);


  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
  };

  const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : "";

  return (
    <div className=" p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center ">Book Appointment</h2>
      <form 
        action={formAction} 
        onError={() => toast("Check your form fields.")} 
        onSubmit={() => toast("Booking has been made")}
        >
        <div className="mb-4">
          <Label htmlFor="clientName" className="mb-2 text-muted-foreground">Your Name</Label>
          <Input
            type="text"
            id="clientName"
            name="clientName"
            placeholder="Jane Doe"
            required
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="clientPhone" className="mb-2 text-muted-foreground">Phone Number</Label>
          <Input
            type="tel"
            id="clientPhone"
            name="clientPhone"
            placeholder="083 456 7890"
            required
          />

          {formState?.error && (
            <p className="mt-2 text-sm text-destructive">{formState.error}</p>
          )}
        </div>

        <div className="mb-4">
          <Select name="service" required>
            <SelectTrigger id="service" className="w-full">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Haircut">Haircut</SelectItem>
                <SelectItem value="Shave">Shave</SelectItem>
                <SelectItem value="Trim">Trim</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <Select name="barber">
            <SelectTrigger id="barber" className="w-full">
              <SelectValue placeholder="Select barber" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="Mike">Mike</SelectItem>
                <SelectItem value="Sarah">Sarah</SelectItem>
                <SelectItem value="Bjorn">Bjorn</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <Calendar24
            date={selectedDate}
            time={selectedTime}
            onDateChange={handleDateChange}
            onTimeChange={handleTimeChange}
          />
          <input type="hidden" name="bookingDate" value={formattedDate} />
        </div>


        <SubmitButton />
      </form>
    </div>
  );
}