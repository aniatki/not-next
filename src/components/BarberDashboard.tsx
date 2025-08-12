"use client"

import React from 'react';
import BookingCard from "./BookingCard";
import { Booking } from "@/app/actions/types";
import { DocumentData } from 'firebase/firestore';

export default function BarberDashboard({ barberData, uid }: { barberData: DocumentData | null | undefined, uid: string }) {
  if (!barberData) {
    return <p className="text-muted-foreground">No barber data found. Please contact your service provider.</p>
  }
  const bookings = (barberData.bookings || []).filter(Boolean) as Booking[];

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Upcoming bookings for {barberData.email}</h2>
      <p className="mb-4">Total Bookings: {`${bookings.length}`}</p>

      {bookings.length === 0 ? (
        <p>No bookings found for this proprietor.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
          {bookings.map((booking: Booking) => (
            <BookingCard key={booking.id} booking={booking} uid={uid} />
          ))}
        </div>
      )}
    </div>
  );
}
