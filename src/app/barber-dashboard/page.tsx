"use client"

import BarberDashboard from "@/components/BarberDashboard";
import { signInWithRedirect, User, getRedirectResult, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "../../../firebase/firebase.config";
import { Button } from "@/components/ui/button";
import { ReactElement, useState, useEffect } from "react";

export default function BarberLoginPage(): ReactElement {
    const [userT, setUserT] = useState<User | null>(null);

    useEffect(() => {
        const handleRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result) {
                    setUserT(result.user);
                }
            } catch (error) {
                console.error("Error during sign-in redirect:", error);
            }
        };

        handleRedirectResult();

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserT(user);
            } else {
                setUserT(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSignIn = async () => {
        try {
            await signInWithRedirect(auth, provider);
        } catch (error) {
            console.error("Error during sign-in redirect:", error);
        }
    };

    return (
        <div className="flex flex-col mx-auto max-w-3xl">
            <BarberDashboard />
        </div>
    );
}