// import { signOut, useSession } from "next-auth/react";
//
// const DashboardPage = () => {
//   const { data: session } = useSession();
//
//   return (
//     <div>
//       <button
//         onClick={() => signOut({ callbackUrl: process.env.NEXTAUTH_URL })}
//       >
//         Logout
//       </button>
//     </div>
//   );
// };
//
// export default DashboardPage;
//

import React, { useEffect, useState } from "react";
import styles from "../styles/Dashboard.module.scss";
import Header from "../components/header/header";
import { useRouter } from "next/router";
import MainTilesSection from "../components/mainTilesSection/mainTilesSection";
import AddButton from "../components/buttons/addButton/addButton";
import AddTransactionModal from "../components/addTransactionModal/addTransactionModal";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import CryptoPricesTable from "../components/cryptoPricesTable/cryptoPricesTable";
import TransparentButton from "../components/buttons/transparentButton/transparentButton";
import HistoryIcon from "@material-ui/icons/History";
import CachedIcon from "@material-ui/icons/Cached";
import RefreshIndicator from "../components/refreshIndicator/refreshIndicator";
import { getSession, useSession } from "next-auth/react";

const DashboardPage = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [profileInfo, setProfileInfo] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetchingDashboardTilesData, setIsFetchingDashboardTilesData] =
    useState(false);
  const [userTransactions, setUserTransactions] = useState([]);
  const [howMuchInvested, setHowMuchInvested] = useState(0);
  const [portfolioPrice, setPortfolioPrice] = useState(0);

  const [addTransactionModalIsOpen, setAddTransactionModalIsOpen] =
    useState(false);

  const getUserTransactions = async () => {
    const allTransactionsRes = await axios.get(API_TRANSACTIONS);
    const allTransactions = allTransactionsRes.data;
    const transactionsArr = [];

    for (const key in allTransactions) {
      transactionsArr.push({
        id: key,
        purchasedCryptoId: allTransactions[key].purchasedCryptoId,
        purchasedCryptoSymbol: allTransactions[key].purchasedCryptoSymbol,
        purchasedDate: allTransactions[key].purchasedDate,
        purchasedPrice: allTransactions[key].purchasedPrice,
        quantity: allTransactions[key].quantity,
        userId: allTransactions[key].userId,
      });
    }
    const filteredTransactions = transactionsArr.filter(
      (transaction) => transaction.userId === profileInfo.id
    );
    setUserTransactions(filteredTransactions);
    return filteredTransactions;
  };

  const calculateHowMuchInvested = (transactions) => {
    let counter = 0;
    if (transactions) {
      transactions.forEach((transaction) => {
        counter += transaction.purchasedPrice * transaction.quantity;
      });
      setHowMuchInvested(counter);
    }
    return counter;
  };

  const getCryptoCurrentPrice = async (cryptoId) => {
    const cryptoData = await axios.get(COIN_PRICE_ROUTE(cryptoId));
    return cryptoData.data[cryptoId].usd;
  };

  const calculatePortfolioPrice = async (transactions) => {
    const pricesArr = await Promise.all(
      transactions.map(
        async (transaction) =>
          (await getCryptoCurrentPrice(transaction.purchasedCryptoId)) *
          transaction.quantity
      )
    );
    const result = pricesArr.reduce((a, b) => a + b, 0);
    setPortfolioPrice(result);
    return result;
  };

  const getDashboardData = async () => {
    const transactions = await getUserTransactions();
    await calculateHowMuchInvested(transactions);
    await calculatePortfolioPrice(transactions);
    setIsFetchingDashboardTilesData(false);
  };

  useEffect(() => {
    // setIsFetchingDashboardTilesData(true);
    // const isAuthStorage = JSON.parse(localStorage.getItem("auth"));
    // const profileInfoStorage = JSON.parse(localStorage.getItem("profileInfo"));
    //
    // setIsAuth(isAuthStorage);
    // setProfileInfo(profileInfoStorage);
    // if (!isAuthStorage || !profileInfoStorage.name) {
    //   router.push("/");
    // }
  }, []);

  const refreshHandler = async () => {
    if (profileInfo.id) {
      setIsRefreshing(true);
      await getDashboardData();
      setIsRefreshing(false);
    }
  };

  // useEffect(() => {
  //   if (profileInfo.id) {
  //     // getDashboardData();
  //   }
  // }, [profileInfo]);

  return (
    <div className={styles.container}>
      <Header profileInfo={profileInfo} />
      {isRefreshing && <RefreshIndicator />}
      <div className={styles.buttonsWrapper}>
        <TransparentButton
          icon={<CachedIcon style={{ fontSize: 30, color: "white" }} />}
          onClick={refreshHandler}
        />
        <TransparentButton
          icon={<HistoryIcon style={{ fontSize: 30, color: "white" }} />}
          onClick={() => router.push("/transactions")}
        />
        <AddButton onClick={() => setAddTransactionModalIsOpen(true)} />
      </div>
      <MainTilesSection
        howMuchInvested={howMuchInvested}
        portfolioPrice={portfolioPrice}
        allProfit={portfolioPrice - howMuchInvested}
        isLoading={isFetchingDashboardTilesData}
      />
      <CryptoPricesTable transactions={userTransactions} />
      <AddTransactionModal
        isOpen={addTransactionModalIsOpen}
        setIsOpen={setAddTransactionModalIsOpen}
      />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);

  return {
    props: {},
  };
}

export default DashboardPage;
