"use server";
import { db } from "@/db";
import { holdings, portfolio, transactions } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq, sql } from "drizzle-orm";
import { headers } from "next/headers";

export const buyAsset = async (_previousState: unknown, data: FormData) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    return { error: "User not authenticated" };
  }

  try {
    const formData = Object.fromEntries(data);
    const quantity = Number(formData.quantity);
    const symbol = formData.symbol as string;
    const price = Number(formData.price);
    const total = Number(formData.total);

    const [userPortfolio] = await db
      .select()
      .from(portfolio)
      .where(eq(portfolio.userId, session.user.id));

    if (!userPortfolio) {
      return { error: "Portfolio not found" };
    }

    //subtract the balance from total portfolio check
    if (userPortfolio.balance && Number(userPortfolio.balance) < total) {
      return { error: "Insufficient funds to purchase" };
    }

    await db
      .update(portfolio)
      .set({
        balance: sql`${portfolio.balance} - ${total}`,
        updatedAt: new Date(),
      })
      .where(eq(portfolio.id, userPortfolio.id));

    //create transaction
    await db.insert(transactions).values({
      portfolioId: userPortfolio.id,
      type: "buy",
      amountUsd: total.toFixed(2),
      symbol: symbol,
      price: price.toFixed(2),
      quantity: quantity.toFixed(8),
    });
    //add to holdings, if there is existing add to quantity and edit avgbuyprice

    const [existingHolding] = await db
      .select()
      .from(holdings)
      .where(
        and(
          eq(holdings.portfolioId, userPortfolio.id),
          eq(holdings.symbol, symbol)
        )
      );
    if (!existingHolding) {
      await db.insert(holdings).values({
        portfolioId: userPortfolio.id,
        symbol,
        quantity: quantity.toFixed(8),
        avgBuyPrice: price.toFixed(2),
      });
    } else {
      const oldQuantity = Number(existingHolding.quantity);
      const oldAvgPrice = Number(existingHolding.avgBuyPrice);

      const newQuantity = oldQuantity + quantity;
      const newAvgPrice =
        (oldQuantity * oldAvgPrice + quantity * price) / newQuantity;

      await db
        .update(holdings)
        .set({
          quantity: newQuantity.toFixed(8),
          avgBuyPrice: newAvgPrice.toFixed(2),
        })
        .where(eq(holdings.id, existingHolding.id));
    }
    return { success: true };
  } catch (error) {
    return { error: "Failed to buy asset" };
  }
};
