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
import prisma from "../prisma/prisma";

const DashboardPage = ({ data }) => {
  const router = useRouter();
  const { data: session } = useSession();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [howMuchInvested, setHowMuchInvested] = useState(data?.moneyInvested);
  const [portfolioPrice, setPortfolioPrice] = useState(0);
  const [profit, setProfit] = useState();
  const [userData, setUserData] = useState(data);

  const [addTransactionModalIsOpen, setAddTransactionModalIsOpen] =
    useState(false);

  const fetchPortfolioData = async () => {
    setIsRefreshing(true);
    const portfolioDataRes = await axios.get("/api/portfolio-price");
    const { portfolioPrice, moneyInvested, allProfit } = portfolioDataRes.data;

    setProfit(allProfit);
    setHowMuchInvested(moneyInvested);
    setPortfolioPrice(portfolioPrice);
    setIsRefreshing(false);
  };

  const fetchUserData = async () => {
    setIsRefreshing(true);
    const userDataRes = await axios.get("/api/user-data");
    const { data } = userDataRes.data;
    setUserData(data);
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  return (
    <div className={styles.container}>
      <Header />
      {isRefreshing && <RefreshIndicator />}
      <div className={styles.buttonsWrapper}>
        <TransparentButton
          icon={<CachedIcon style={{ fontSize: 30, color: "white" }} />}
          onClick={fetchPortfolioData}
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
        allProfit={profit}
        isLoading={isRefreshing}
      />
      <CryptoPricesTable availableCrypto={userData.availableCrypto} />
      <AddTransactionModal
        isOpen={addTransactionModalIsOpen}
        setIsOpen={setAddTransactionModalIsOpen}
        handleRefresh={() => {
          fetchPortfolioData();
          fetchUserData();
        }}
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

  const currentUser = await prisma.user.findFirst({
    where: {
      email: session?.user?.email,
    },
    select: {
      id: true,
      moneyInvested: true,
      availableCrypto: {
        select: {
          id: true,
          purchasedCryptoId: true,
          purchasedCryptoSymbol: true,
          quantity: true,
        },
      },
    },
  });

  return {
    props: {
      data: currentUser,
    },
  };
}

export default DashboardPage;
