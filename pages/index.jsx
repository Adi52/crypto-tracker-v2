import { useSession, signIn, getSession, getProviders } from "next-auth/react";
import {
  GithubLoginButton,
  createButton,
  GoogleLoginButton,
} from "react-social-login-buttons";

const EmailLoginButton = createButton({
  text: "Log in with e-mail",
  icon: "mail",
  style: { background: "white", color: "black" },
  activeStyle: { background: "#dcdcdc" },
});

export default function Home({ providers }) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-white text-4xl md:text-8xl font-montserrat font-bold font-center">
        CRYPTO TRACKER
      </h1>
      <div className="flex flex-col items-center justify-center p-8 mt-20 max-w-md w-full">
        <GithubLoginButton
          onClick={() =>
            signIn(providers.github.id, {
              callbackUrl: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
            })
          }
        />
        <GoogleLoginButton
          onClick={() =>
            signIn(providers.google.id, {
              callbackUrl: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
            })
          }
        />
        <EmailLoginButton
          onClick={() =>
            signIn(null, {
              callbackUrl: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
            })
          }
        />
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  const providers = await getProviders();

  return {
    props: { providers },
  };
}
