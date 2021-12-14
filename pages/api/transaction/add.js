import { getSession } from "next-auth/react";
import prisma from "../../../prisma/prisma";

export default async (req, res) => {
  const session = await getSession({ req: req });

  if (!session?.user) {
    return res.status(400).json({ message: "Not authenticated" });
  }

  if (req.method === "POST") {
    const foundUser = await prisma.user.findFirst({
      where: {
        email: session?.user?.email,
      },
    });

    const purchasedCryptoId = req.body.purchasedCryptoId;
    const purchasedCryptoSymbol = req.body.purchasedCryptoSymbol;
    const purchasedPrice = req.body.purchasedPrice;
    const quantity = req.body.quantity;
    const purchasedDate = req.body.purchasedDate;

    try {
      const availableCrypto = await prisma.availableCrypto.findFirst({
        where: {
          purchasedCryptoId,
        },
      });

      if (availableCrypto) {
        await prisma.availableCrypto.update({
          where: {
            id: availableCrypto.id,
          },
          data: {
            quantity: availableCrypto.quantity + quantity,
          },
        });
      } else {
        await prisma.availableCrypto.create({
          data: {
            purchasedCryptoId: purchasedCryptoId,
            purchasedCryptoSymbol: purchasedCryptoSymbol,
            userId: foundUser.id,
            quantity: quantity,
          },
        });
      }

      const transaction = await prisma.transaction.create({
        data: {
          userId: foundUser?.id,
          purchasedCryptoId,
          purchasedCryptoSymbol,
          purchasedDate,
          purchasedPrice,
          quantity,
        },
      });

      await prisma.user.update({
        where: {
          id: foundUser.id,
        },
        data: {
          moneyInvested: (foundUser.moneyInvested +=
            +purchasedPrice * +quantity),
        },
      });

      return res.status(200).json(transaction);
    } catch (e) {
      console.log(e);
      return res.status(402).json(e);
    }
  } else {
    return res.status(400).json({ message: "Method not allowed" });
  }
};
