"use server";

import { db } from "../../../firebase/firebase.config";
import { addDoc, collection, serverTimestamp, updateDoc, doc, Timestamp, DocumentData, getFirestore } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { BookingStatus, NewBooking } from "./types";
import { InitialState } from "../types/types";
import { cookies } from 'next/headers';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { getAdminApp, getAdminAuth } from '@/lib/firebase-admin';
import { initializeApp } from "firebase/app";

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
      error: "Invalid phone number."
    };
  }

  const combinedDateTimeString = `${bookingDate}T${bookingTime}:00`;
  const appointmentDate = new Date(combinedDateTimeString);

  if (isNaN(appointmentDate.getTime())) {
    return {
      success: false,
      id: null,
      error: "Invalid booking date or time format."
    };
  }

  const bookingTimestamp = Timestamp.fromDate(appointmentDate);

  try {
    const newBooking: NewBooking = {
      clientName,
      clientPhone,
      service,
      barber,
      bookingTime: bookingTimestamp,
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

export async function updateBookingStatus(uid: string, bookingId: string | undefined, newStatus: string): Promise<{ success: boolean, message: string | null }> {
  try {
    if (!uid || typeof uid !== 'string' || !bookingId || typeof bookingId !== 'string') {
      console.error('Error updating booking status: Invalid input received.', { uid, bookingId });
      return { success: false, message: 'Invalid proprietor or booking ID.' };
    }

    const adminDb = getAdminFirestore(getAdminApp());
    const proprietorDoc = await adminDb.collection('proprietors').doc(uid).get();

    if (!proprietorDoc.exists) {
      console.error('Proprietor document not found for UID:', uid);
      return { success: false, message: 'Proprietor not found.' };
    }

    const { firebaseConfig } = proprietorDoc.data() as DocumentData;
    if (!firebaseConfig) {
      console.error('firebaseConfig not found in proprietor document for UID:', uid);
      return { success: false, message: 'Proprietor database config not found.' };
    }
    
    const clientApp = initializeApp(firebaseConfig, `proprietor-${uid}`);
    const clientDb = getFirestore(clientApp);
    
    const bookingDocRef = doc(clientDb, "bookings", bookingId);

    await updateDoc(bookingDocRef, {
      status: newStatus
    });

    revalidatePath('/barber-dashboard');

    return { success: true, message: null };

  } catch (error) {
    console.error('Error updating booking status:', error);
    return { success: false, message: 'Failed to update booking status.' };
  }
}


const FIVE_DAYS_IN_MS = 60 * 60 * 24 * 5 * 1000;
export async function createSession(idToken: string) {
  try {
    const sessionCookie = await getAdminAuth().createSessionCookie(idToken, { expiresIn: FIVE_DAYS_IN_MS });
    const cookieStore = await cookies();

    cookieStore.set('session', sessionCookie, {
      maxAge: FIVE_DAYS_IN_MS,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
  } catch (error) {
    console.error('Failed to create session cookie:', error);
  }
}

export async function deleteSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;

    if (sessionCookie) {
      cookieStore.delete('session');
      const decodedClaims = await getAdminAuth().verifySessionCookie(sessionCookie);
      await getAdminAuth().revokeRefreshTokens(decodedClaims.sub);
    }
  } catch (error) {
    console.error('Failed to delete session:', error);
  }
}