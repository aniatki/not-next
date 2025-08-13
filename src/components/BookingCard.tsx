"use client"
import { updateBookingStatus } from "@/app/actions/actions";
import { BookingStatus, Booking } from "@/app/actions/types";
import { ReactNode, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { CalendarFold, Check, CheckCheck, Clock, Ghost, Handbag, LoaderCircle, Phone, UserRoundSearch, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function BookingCard({ booking, uid }: { booking: Booking, uid: string }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!booking?.id || !uid) {
      console.error("BookingCard: Cannot update status. Missing booking ID or UID.");
      return;
    }
    setIsUpdating(true)
    await updateBookingStatus(uid, booking.id, newStatus);
    setIsUpdating(false)
  };

  const status = (status: BookingStatus): ReactNode => {
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
    <Card
      className={`
        mb-4
        ${booking.status === "pending" && "opacity-100 font-bold outline-3 -outline-offset-3"}
        ${booking.status === "rejected" && "opacity-65"}
        ${booking.status === "no-show" && "opacity-65"}
        `}>
      <CardHeader className="-mt-2 -mb-4 flex justify-between items-center">
        <CardTitle className="text-lg font-semibold">{booking.clientName}</CardTitle>
        {isUpdating ? <LoaderCircle /> : status(booking.status)}
      </CardHeader>
      <CardContent className="opacity-70">
        <div className="mb-2 flex items-center gap-2">
          <Phone size={16} /> {booking.clientPhone}
        </div>
        <div className="mb-2 flex items-center gap-2">
          <Handbag size={16} /> {booking.service}
        </div>
        <div className="mb-2 flex items-center gap-2">
          <UserRoundSearch size={16} /> {booking.barber}
        </div>
        <div className="mb-2 flex items-center gap-2">
          <CalendarFold size={16} /> {booking.bookingDate}
        </div>
        <div className="mb-2 flex items-center gap-2">
          <Clock size={16} /> {booking.bookingTime}
        </div>
      </CardContent>

      <CardFooter>
        {booking.status === BookingStatus.Pending && (
          <>
            <Button
              onClick={() => { 
                const pt = handleUpdateStatus(BookingStatus.Accepted); 
                toast.promise(pt, {
                  loading: "Updating...", 
                  success: () => "Accepted."}) 
              }}
              disabled={isUpdating}
              variant="secondary"
              className="mr-4"
            >
              <Check />
              Accept
            </Button>
            <Button
              onClick={() => { 
                const pt = handleUpdateStatus(BookingStatus.Rejected); 
                toast.promise(pt, {
                  loading: "Updating...", 
                  success: () => "Rejected."}) 
              }}
              disabled={isUpdating}
              variant="destructive"
            >
              <X></X>
              Reject
            </Button>
          </>
        )}
        {booking.status === BookingStatus.Accepted && (
          <>
            <Button
              onClick={() => { 
                const pt = handleUpdateStatus(BookingStatus.Done); 
                toast.promise(pt, {
                  loading: "Updating...", 
                  success: () => "Completed."}) 
              }}
              disabled={isUpdating}
              variant="outline"
            >
              {isUpdating ? <LoaderCircle /> : (<><CheckCheck /> Mark as Done</>)}
            </Button>
            <Button
              onClick={() => { 
                const pt = handleUpdateStatus(BookingStatus.NoShow); 
                toast.promise(pt, {
                  loading: "Updating...",
                  success: () => "Updated to No Show",
                }) 
              }}
              disabled={isUpdating}
              variant="ghost"
            >
              {isUpdating ? <LoaderCircle /> : (<><Ghost /> No Show</>)}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}