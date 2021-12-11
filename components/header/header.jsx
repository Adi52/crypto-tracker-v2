import React from "react";
import styles from "./header.module.scss";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import avatarPlaceholder from "../../utils/constants/avatarPlaceholder";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const Header = () => {
  const { data: session } = useSession();

  return (
    <div className={styles.wrapper}>
      <div className={styles.innerWrapper}>
        <div className={styles.logo}>
          <Link href={"/dashboard"}>
            <h1>CRYPTO TRACKER</h1>
          </Link>
        </div>
        <div className={styles.rightSide}>
          <div className={styles.profileWrapper}>
            <img
              src={
                session?.user?.image ? session?.user?.image : avatarPlaceholder
              }
            />
          </div>
          <div
            className={styles.logoutWrapper}
            onClick={async () =>
              await signOut({
                callbackUrl: process.env.NEXT_PUBLIC_URL,
              })
            }
          >
            <ExitToAppIcon />
            <p>Wyloguj</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
