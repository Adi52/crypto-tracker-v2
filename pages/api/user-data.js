import { getSession } from "next-auth/react";
import prisma from "../../prisma/prisma";

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
    return res.status(200).json({ data: foundUser });
  } else {
    return res.status(400).json({ message: "Method not allowed" });
  }
};
