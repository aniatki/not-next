import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="w-full cursor-pointer hover:bg-black/70"
      type="submit"
      disabled={pending}
    >
      {pending ? "Booking..." : "Book Appointment"}
    </Button>
  );
}