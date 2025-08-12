import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="w-full cursor-pointer bg-primary text-primary-foreground"
      type="submit"
      disabled={pending}
    >
      {pending ? <LoaderCircle/> : "Book Appointment"}
    </Button>
  );
}