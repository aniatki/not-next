"use client"

import BarberDashboard from "@/components/BarberDashboard";
import { signInWithPopup, User, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "../../../firebase/firebase.config";
import { Button } from "@/components/ui/button";
import { ReactElement, useState, useEffect } from "react";

export default function BarberLoginPage(): ReactElement {
    const [userT, setUserT] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUserT(user);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSignIn = async () => {
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error during sign-in:", error);
        }
    };

    if (isLoading) {
        return <h1 className="text-muted-foreground text-center text-xl">Page is loading.</h1>

    }

    return (
        <div className="flex flex-col mx-auto max-w-3xl">
            {userT ? (
                <BarberDashboard />
            ) : (
                <div>
                    <p>Please sign in to access the dashboard.</p>
                    <Button onClick={handleSignIn}>Sign in with Google</Button>
                </div>
            )}
        </div>
    );
}