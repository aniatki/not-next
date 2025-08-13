"use server";

import { updateDoc, doc, DocumentData, getFirestore } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { cookies } from 'next/headers';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { getAdminApp, getAdminAuth } from '@/lib/firebase-admin';
import { initializeApp } from "firebase/app";

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