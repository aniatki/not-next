"use server";

import { db } from "../../../firebase/firebase.config";
import { addDoc, collection, serverTimestamp, updateDoc, doc } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { Booking, BookingStatus } from "./types";
import { InitialState } from "../types/types";

function validatePhoneNumber(phoneNumber: string): boolean {
  const strippedNumber = phoneNumber.replace(/\s/g, "");
  const phoneRegex = /^(?:\+\d{11}|\d{10}|\d{12})$/;
  return phoneRegex.test(strippedNumber);
}
export async function createBooking(prevState: InitialState, formData: FormData): Promise<InitialState> {
  const clientName = formData.get("clientName") as string;
  const clientPhone = formData.get("clientPhone") as string;
  const service = formData.get("service") as string;
  const barber = formData.get("barber") as string;
  const bookingDate = formData.get("bookingDate") as string;
  const bookingTime = formData.get("bookingTime") as string;

  if (!clientName || !clientPhone || !service || !barber || !bookingDate || !bookingTime) {
    console.error("Missing required fields.");
    return {
      success: false,
      id: null,
      error: "Please fill out all required fields."
    };
  }

  if (!validatePhoneNumber(clientPhone)) {
    return { 
      success: false, 
      id: null, 
      error: "Invalid phone number." };
  }

  try {
    const newBooking: Omit<Booking, 'id'> = {
      clientName,
      clientPhone,
      service,
      barber,
      bookingDate,
      bookingTime,
      status: BookingStatus.Pending,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "bookings"), newBooking);

    console.log("Successfully created new booking with ID:", docRef.id);

    revalidatePath("/");

    return { 
      success: true, 
      id: docRef.id, 
      error: null 
    };

  } catch (e) {
    console.error("Error adding booking to Firestore:", e);
    return { 
      success: false, 
      id: null,
      error: "An error occurred while creating the booking." 
    };
  }
}


export async function updateBookingStatus(bookingId: string, newStatus: BookingStatus): Promise<{success: boolean | undefined, error: string | null}> {
  try {
    if (!Object.values(BookingStatus).includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}`);
    }

    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, {
      status: newStatus,
    });

    console.log(`Successfully updated booking ${bookingId} to status: ${newStatus}`);

    revalidatePath("/");

    return { 
      success: true, 
      error: null 
    };

  } catch (e) {
    console.error("Error updating booking status:", e);
    return { 
      success: false, 
      error: "An error occurred while updating the booking status." 
    };
  }
}

