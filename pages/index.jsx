import Head from "next/head";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-700">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>CRYPTO TRACKER</h1>
        {!session ? (
          <>
            Not Signed in <br />
            <button onClick={signIn}>Sign In</button>
          </>
        ) : (
          <>
            Signed in as {session.user.email} <br />
            <button onClick={signOut}>Sign Out</button>
          </>
        )}
      </main>
    </div>
  );
}
