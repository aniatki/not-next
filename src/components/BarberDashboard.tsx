"use client"

import { useEffect, useState } from "react";
import BookingCard from "./BookingCard";
import { collection, onSnapshot, query } from "firebase/firestore";
import { Booking } from "@/app/actions/types";
import { db } from "../../firebase/firebase.config";

export default function BarberDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bookingsQuery = query(collection(db, "bookings"));
    
    const unsubscribe = onSnapshot(bookingsQuery, (snapshot) => {
      const allBookings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Booking, 'id'>),
      }));

      allBookings.sort((a, b) => {
        const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;
        return bTime - aTime;
      });

      setBookings(allBookings);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching Firestore data:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Booking Dashboard</h2>
      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
}


