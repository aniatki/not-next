"use client"

import { useEffect, useState } from 'react';
import { signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, User, UserCredential } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { auth, provider } from "../../../firebase/firebase.config";
import { createSession, deleteSession } from '../actions/actions';
import { DecodedIdToken } from 'firebase-admin/auth';
import BarberDashboard from '@/components/BarberDashboard';
import LinearIndeterminate from '@/components/ui/material/LinearIndeterminate';
import { toast } from 'sonner';

export default function BarberLoginClient({ user: serverUser, barberData }: { user: DecodedIdToken | null, barberData: FirebaseFirestore.DocumentData | null | undefined }) {
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
      // @ts-ignore
      setClientUser(user);
    });

    return () => unsubscribe();
  }, [serverUser]);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      const pt: UserCredential = await signInWithPopup(auth, provider)
      // @ts-ignore
      toast.promise(pt, {
        loading: "Waiting for authentication",
        success: (_) => {
          return `Successfully signed in.`
        },
        error: "Error signing in.",
      })
      
    } catch (error) {
      console.error("Error during sign-in:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const pt = await firebaseSignOut(auth);
      // @ts-ignore
      toast.promise(pt, {
        success: () => {
          return "Signed out."
        },
        error: "Error signing out.",
      })
    } catch (error) {
      console.error("Error during sign-out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LinearIndeterminate />
  }

  return (
    <div className="flex flex-col mx-auto p-4">
      {clientUser ? (<>
        <Button onClick={handleSignOut}>Sign Out</Button>
        <BarberDashboard barberData={barberData} uid={clientUser.uid} avatarImage={clientUser.picture}/>
      </>
      ) : (
        <div>
          <Button variant="outline" onClick={handleSignIn}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Sign in with Google
          </Button>
        </div>
      )}
    </div>
  );
}
