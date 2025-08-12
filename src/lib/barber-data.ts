import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from './firebase-admin';
import { initializeApp } from "firebase/app";
import { collection, getFirestore, getDocs, query, orderBy } from "firebase/firestore";

export async function getBarberData(uid: string) {
  try {
    const adminDb = getAdminFirestore(getAdminApp());
    console.log("adminDb", adminDb)
    const docRef = adminDb.collection('proprietors').doc(uid);
    console.log("docRef", docRef)
    const docSnap = await docRef.get();
    console.log("docSnap", docSnap)

    if (!docSnap.exists) {
      console.log(`No proprietor document found for UID: ${uid}`);
      return null;
    }

    const proprietorData = docSnap.data();
    console.log("proprietorData", proprietorData)

    const firebaseConfig = proprietorData?.firebaseConfig;
    console.log("firebaseConfig", firebaseConfig)

    if (!firebaseConfig) {
      console.log(`No firebaseConfig found in proprietor document for UID: ${uid}`);
      return proprietorData;
    }

    const clientApp = initializeApp(firebaseConfig, `proprietor-${uid}`);
    console.log("clientApp", clientApp)
    const clientDb = getFirestore(clientApp);
    console.log("clientDb", clientDb)

    const bookingsCollectionRef = collection(clientDb, "bookings");
    console.log("bookingsCollectionRef", bookingsCollectionRef)

    const bookingsQuery = query(bookingsCollectionRef, orderBy('createdAt', 'desc'));
    console.log("bookingsQuery", bookingsQuery)

    const bookingsSnapshot = await getDocs(bookingsQuery);
    console.log("bookingsSnapshot", bookingsSnapshot)


    const bookings = bookingsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
      }
    });

    console.log("bookings", bookings)


    return {
      ...proprietorData,
      bookings: bookings,
    };

  } catch (error) {
    console.error('Error fetching barber data:', error);
    return null;
  }
}