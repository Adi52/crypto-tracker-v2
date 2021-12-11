import { useSession, signIn, signOut, getSession } from "next-auth/react";
import Button from "../components/Button";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div>
      <h1 className="text-white text-4xl md:text-8xl font-montserrat font-bold font-center">
        CRYPTO TRACKER
      </h1>
      <div className="flex items-center justify-center p-8 mt-20">
        <Button
          onClick={() =>
            signIn(null, {
              callbackUrl: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
            })
          }
          title={"Log In / Sign Up"}
        />
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);

  return {
    props: {},
  };
}
