"use client"

import { useEffect, useState } from 'react';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { auth, provider } from "../../../firebase/firebase.config";
import { createSession, deleteSession } from '../actions/actions';
import { DecodedIdToken } from 'firebase-admin/auth';
import BarberDashboard from '@/components/BarberDashboard';

export default function BarberLoginClient({ user: serverUser, barberData }: { user: DecodedIdToken | User | null, barberData: FirebaseFirestore.DocumentData | null | undefined }) {
  const [clientUser, setClientUser] = useState(serverUser);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && !serverUser) {
        console.log("Client-side user detected. Creating server session...");
        const idToken = await user.getIdToken();
        await createSession(idToken);
      } else if (!user && serverUser) {
        console.log("Client-side user signed out. Deleting server session...");
        await deleteSession();
      }
      setClientUser(user);
    });

    return () => unsubscribe();
  }, [serverUser]);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error during sign-in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error during sign-out:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return <h1 className="text-muted-foreground text-center text-xl">Loading...</h1>
  }

  return (
    <div className='flex flex-col mx-auto max-w-3xl p-4'>
      {clientUser ? (<>
        <Button onClick={handleSignOut}>Sign Out</Button>
        <BarberDashboard barberData={barberData}/>
        </>
      ) : (
        <div>
          <p>Please sign in to access the dashboard.</p>
          <Button onClick={handleSignIn}>Sign in with Google</Button>
        </div>
      )}
    </div>
  );
}
