import { updateBookingStatus } from "@/app/actions/actions";
import { BookingStatus, Booking } from "@/app/actions/types";
import { useState } from "react";

export default function BookingCard({ booking }: { booking: Booking }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateStatus = async (newStatus: BookingStatus) => {
    setIsUpdating(true);
    await updateBookingStatus(booking.id!, newStatus);
    setIsUpdating(false);
  };
  
  const statusColor = {
    [BookingStatus.Pending]: "bg-yellow-100 text-yellow-800",
    [BookingStatus.Rejected]: "bg-red-100 text-red-800",
    [BookingStatus.Accepted]: "bg-blue-100 text-blue-800",
    [BookingStatus.Done]: "bg-green-100 text-green-800",
    [BookingStatus.NoShow]: "bg-red-100 text-red-800",
  }[booking.status];

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">{booking.clientName}</h3>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
          {booking.status}
        </span>
      </div>
      <div className="flex flex-col sm:flex-row sm:space-x-4 text-gray-600 text-sm">
        <p><strong>Phone:</strong> {booking.clientPhone}</p>
      </div>
      <div className="flex flex-col sm:flex-row sm:space-x-4 text-gray-600 text-sm">
        <p><strong>Service:</strong> {booking.service}</p>
        <p><strong>Barber:</strong> {booking.barber}</p>
      </div>
      <div className="flex flex-col sm:flex-row sm:space-x-4 text-gray-600 text-sm">
        <p><strong>Date:</strong> {booking.bookingDate}</p>
        <p><strong>Time:</strong> {booking.bookingTime}</p>
      </div>
      
      {/* Action buttons based on status */}
      <div className="flex flex-wrap gap-2 pt-2 border-t mt-auto">
        {booking.status === BookingStatus.Pending && (
          <>
            <button
              onClick={() => handleUpdateStatus(BookingStatus.Accepted)}
              className="flex-1 py-1 px-2 text-sm rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors duration-200 disabled:bg-gray-400"
              disabled={isUpdating}
            >
              Accept
            </button>
            <button
              onClick={() => handleUpdateStatus(BookingStatus.Rejected)}
              className="flex-1 py-1 px-2 text-sm rounded-md bg-red-500 text-white font-medium hover:bg-red-600 transition-colors duration-200 disabled:bg-gray-400"
              disabled={isUpdating}
            >
              Reject
            </button>
          </>
        )}
        {booking.status === BookingStatus.Accepted && (
          <button
            onClick={() => handleUpdateStatus(BookingStatus.Done)}
            className="flex-1 py-1 px-2 text-sm rounded-md bg-green-500 text-white font-medium hover:bg-green-600 transition-colors duration-200 disabled:bg-gray-400"
            disabled={isUpdating}
          >
            Mark as Done
          </button>
        )}
      </div>
    </div>
  );
}