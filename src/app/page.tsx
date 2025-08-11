import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl mb-8">Barber Portal</h1>
        <Link className="bg-primary px-2 rounded-full" href={'/barber-dashboard'}>Sign In</Link>
    </main>
  );
}
