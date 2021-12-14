import { getSession } from "next-auth/react";
import prisma from "../../prisma/prisma";
import axios from "axios";
import { COIN_PRICE_ROUTE } from "../../utils/constants/routers";

const getCryptoCurrentPrice = async (cryptoId) => {
  const cryptoData = await axios.get(COIN_PRICE_ROUTE(cryptoId));
  return cryptoData.data[cryptoId].usd;
};

export default async (req, res) => {
  const session = await getSession({ req: req });

  if (!session?.user) {
    return res.status(400).json({ message: "Not authenticated" });
  }

  if (req.method === "GET") {
    const foundUser = await prisma.user.findFirst({
      where: {
        email: session?.user?.email,
      },
      select: {
        availableCrypto: true,
        moneyInvested: true,
      },
    });

    const pricesArr = await Promise.all(
      foundUser.availableCrypto.map(
        async (crypto) =>
          (await getCryptoCurrentPrice(crypto.purchasedCryptoId)) *
          crypto.quantity
      )
    );
    const portfolioPrice = +pricesArr.reduce((a, b) => a + b, 0).toFixed(2);
    const moneyInvested = +foundUser.moneyInvested.toFixed(2);
    const allProfit = +(portfolioPrice - moneyInvested).toFixed(2);

    return res.status(200).json({ portfolioPrice, moneyInvested, allProfit });
  } else {
    return res.status(400).json({ message: "Method not allowed" });
  }
};
