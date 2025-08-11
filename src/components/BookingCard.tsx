import { updateBookingStatus } from "@/app/actions/actions";
import { BookingStatus, Booking } from "@/app/actions/types";
import { ReactNode, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { CalendarFold, Clock, Handbag, Phone, UserRoundSearch } from 'lucide-react';


export default function BookingCard({ booking }: { booking: Booking }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const handleUpdateStatus = async (newStatus: BookingStatus) => {
    setIsUpdating(true);
    await updateBookingStatus(booking.id!, newStatus);
    setIsUpdating(false);
  };

  function status(status: BookingStatus): ReactNode {
    
    switch (status) {
      case "accepted":
        return <Badge variant={"default"}>Accepted</Badge>
      case "rejected":
        return <Badge variant={"destructive"}>Rejected</Badge>
      case "pending":
        return <Badge variant={"outline"}>Pending</Badge>
      case "no-show":
        return <Badge variant={"destructive"}>No Show</Badge>
      case "done":
        return <Badge variant={"secondary"}>Done</Badge>
      default:
        return <Badge variant={"secondary"}>Pending</Badge>

    }
  }

  return (
    <div 
      className={`
        p-4 
        rounded-lg 
        shadow-sm 
        border 
        flex 
        flex-col 
        space-y-3 
        ${booking.status === "pending" && "opacity-100 font-bold outline-ring outline-3"}
        ${booking.status === "rejected" && "opacity-65"}
        ${booking.status === "no-show" && "opacity-65"}
        `}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{booking.clientName}</h3>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium`}>
          {status(booking.status)}
        </span>
      </div>
      <div className="flex flex-col sm:flex-row sm:space-x-4 text-sm">
        <div className="flex items-center gap-2">
          <Phone size={16} /> {booking.clientPhone}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:space-x-4 text-sm">
        <div className="flex items-center gap-2">
          <Handbag size={16} /> {booking.service}
        </div>
        <div className="flex items-center gap-2">
          <UserRoundSearch size={16} /> {booking.barber}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:space-x-4 text-sm">
        <div className="flex items-center gap-2">
          <CalendarFold size={16} /> {booking.bookingDate}
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} /> {booking.bookingTime}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-2 border-t mt-auto">
        {booking.status === BookingStatus.Pending && (
          <>
            <Button
              onClick={() => handleUpdateStatus(BookingStatus.Accepted)}
              disabled={isUpdating}
              variant="default"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/80"
            >
              Accept
            </Button>
            <Button
              onClick={() => handleUpdateStatus(BookingStatus.Rejected)}
              disabled={isUpdating}
              variant="destructive"
            >
              Reject
            </Button>
          </>
        )}
        {booking.status === BookingStatus.Accepted && (
          <Button
            onClick={() => handleUpdateStatus(BookingStatus.Done)}
            disabled={isUpdating}
            variant="default"
          >
            Mark as Done
          </Button>
        )}
      </div>
    </div>
  );
}