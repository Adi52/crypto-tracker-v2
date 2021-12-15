import React from "react";
import { useRouter } from "next/router";
import Header from "../components/header/header";
import styles from "../styles/Transactions.module.scss";
import TransactionsTable from "../components/transactionsTable/transactionsTable";
import TransparentButton from "../components/buttons/transparentButton/transparentButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { getSession } from "next-auth/react";
import prisma from "../prisma/prisma";

const TransactionsPage = ({ data }) => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.buttonsWrapper}>
        <TransparentButton
          icon={<ArrowBackIcon style={{ fontSize: 30, color: "white" }} />}
          onClick={() => router.push("/dashboard")}
        />
      </div>

      <TransactionsTable transactionsArr={data} />
    </div>
  );
};

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);

  const currentUser = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
  });

  const transactions = await prisma.transaction.findMany({
    where: {
      userId: currentUser.id,
    },
  });

  const fixedTransactions = transactions.map((transaction) => {
    transaction.purchasedDate = JSON.parse(
      JSON.stringify(transaction.purchasedDate)
    );
    transaction.createdAt = JSON.parse(JSON.stringify(transaction.createdAt));
    return transaction;
  });

  return {
    props: {
      data: fixedTransactions,
    },
  };
}

export default TransactionsPage;
