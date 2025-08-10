"use client";

import BookingForm from "@/components/BookingForm";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col md:flex-row p-4 gap-8 bg-gray-100">
        <BookingForm />
    </main>
  );
}
