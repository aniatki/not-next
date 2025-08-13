import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from './firebase-admin';
import { initializeApp } from "firebase/app";
import { collection, getFirestore, getDocs, query, orderBy } from "firebase/firestore";

export async function getBarberData(uid: string) {
  try {
    const adminDb = getAdminFirestore(getAdminApp());
    const docRef = adminDb.collection('proprietors').doc(uid);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      console.log(`No proprietor document found for UID: ${uid}`);
      return null;
    }

    const proprietorData = docSnap.data();
    const firebaseConfig = proprietorData?.firebaseConfig;

    if (!firebaseConfig) {
      console.log(`No firebaseConfig found in proprietor document for UID: ${uid}`);
      return proprietorData;
    }

    const clientApp = initializeApp(firebaseConfig, `proprietor-${uid}`);
    const clientDb = getFirestore(clientApp);
    const bookingsCollectionRef = collection(clientDb, "bookings");
    const bookingsQuery = query(bookingsCollectionRef, orderBy('createdAt', 'desc'));
    const bookingsSnapshot = await getDocs(bookingsQuery);
    const bookings = bookingsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...doc.data(),
        bookingTime: data.bookingTime.toDate(),
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
      }
    });

    return {
      ...proprietorData,
      bookings: bookings,
    };

  } catch (error) {
    console.error('Error fetching barber data:', error);
    return null;
  }
}