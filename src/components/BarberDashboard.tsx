"use client";

import { useEffect, useState } from "react";
import { getApps, initializeApp } from "firebase/app";
import { getFirestore, collection, query, orderBy, onSnapshot } from "firebase/firestore";

import BookingCard from "./BookingCard";
import { Booking } from "@/app/actions/types";
import { DocumentData } from "firebase/firestore";
import {
  format,
  isToday,
  isYesterday,
  isBefore,
  isAfter,
  parseISO,
  startOfDay,
  isTomorrow,
  getYear,
} from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Calendar, User } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";

export default function BarberDashboard({
  avatarImage,
  barberData,
  uid,
}: {
  avatarImage: string | Blob | undefined;
  barberData: DocumentData | null | undefined;
  uid: string;
}) {

  const [bookings, setBookings] = useState<Booking[]>(() =>
    (barberData?.bookings || []).filter(Boolean) as Booking[]
  );

  useEffect(() => {
    if (!barberData?.firebaseConfig) return;

    const appName = `proprietor-${uid}`;
    const clientApp =
      getApps().find((app) => app.name === appName) ||
      initializeApp(barberData.firebaseConfig, appName);

    const clientDb = getFirestore(clientApp);
    const q = query(collection(clientDb, "bookings"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const updatedBookings = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          bookingTime: data.bookingTime?.toDate(),
          createdAt: data.createdAt?.toDate().toISOString() || null,
        } as Booking;
      });
      setBookings(updatedBookings);
    });

    return () => unsubscribe();
  }, [uid, barberData?.firebaseConfig]);

  if (!barberData) {
    return (
      <p className="text-muted-foreground">
        No barber data found. Please contact your service provider.
      </p>
    );
  }

  if (bookings.length === 0) {
    return <p>No bookings found for this proprietor.</p>;
  }

  const today = new Date();
  const pastAndToday: Record<string, Booking[]> = {};
  const future: Record<string, Booking[]> = {};

  const todayStart = startOfDay(today);
  const currentYear = getYear(today);

  bookings.forEach((booking) => {
    const date = booking.bookingTime;
    let label;

    if (isToday(date)) {
      label = "Today";
    } else if (isYesterday(date)) {
      label = "Yesterday";
    } else if (isTomorrow(date)) {
      label = "Tomorrow";
    } else {
      if (getYear(date) === currentYear) {
        label = format(date, "do 'of' MMMM");
      } else {
        label = format(date, "do 'of' MMMM yyyy");
      }
    }

    if (isBefore(date, todayStart) || isToday(date)) {
      if (!pastAndToday[label]) pastAndToday[label] = [];
      pastAndToday[label].push(booking);
    } else if (isAfter(date, todayStart)) {
      if (!future[label]) future[label] = [];
      future[label].push(booking);
    }
  });

  const sortByDateDesc = (a: Booking, b: Booking) =>
    parseISO(b.bookingDate).getTime() - parseISO(a.bookingDate).getTime();
  const sortByDateAsc = (a: Booking, b: Booking) =>
    parseISO(a.bookingDate).getTime() - parseISO(b.bookingDate).getTime();

  Object.values(pastAndToday).forEach((arr) => arr.sort(sortByDateDesc));
  Object.values(future).forEach((arr) => arr.sort(sortByDateAsc));

  const getDateFromLabel = (label: string) => {
    if (label === "Today") return today;
    if (label === "Yesterday") return new Date(today.getTime() - 86400000);
    if (label === "Tomorrow") return new Date(today.getTime() + 86400000);
    const booking =
      pastAndToday[label]?.[0] || future[label]?.[0];
    return parseISO(booking.bookingDate);
  };

  const pastAndTodaySorted = Object.entries(pastAndToday).sort(
    ([labelA], [labelB]) =>
      getDateFromLabel(labelB).getTime() - getDateFromLabel(labelA).getTime()
  );

  const futureSorted = Object.entries(future).sort(
    ([labelA], [labelB]) =>
      getDateFromLabel(labelA).getTime() - getDateFromLabel(labelB).getTime()
  );

  return (
    <div className="p-4 mx-auto grid grid-cols-1 sm:grid-cols-2">
      {avatarImage && (
        <Avatar>
          <AvatarImage src={avatarImage as string} />
          <AvatarFallback>
            <User />
          </AvatarFallback>
        </Avatar>
      )}

      <h2 className="font-bold mb-6 text-center col-span-1 sm:col-span-2">
        Bookings for {barberData.email}
      </h2>

      <Sheet>
        <SheetTrigger className="underline cursor-pointer hover:text-secondary">
          Future Appointments
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            {futureSorted.map(([label, items]) => (
              <div key={label} className="mb-6">
                <SheetTitle className="flex mb-2 items-center gap-1">
                  <Calendar size={18} /> {label}
                </SheetTitle>
                {items.map((b) => (
                  <BookingCard key={b.id} booking={b} uid={uid} />
                ))}
              </div>
            ))}
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Accordion type="single" collapsible className="col-span-1 sm:col-span-2">
        {pastAndTodaySorted.map(([label, items], index) => (
          <AccordionItem
            key={index}
            className="grid col-span-full grid-cols-subgrid"
            value={`item-${index}`}
          >
            <div>
              <AccordionTrigger>{label}</AccordionTrigger>
              <AccordionContent>
                {items.map((b) => (
                  <BookingCard key={b.id} booking={b} uid={uid} />
                ))}
              </AccordionContent>
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
