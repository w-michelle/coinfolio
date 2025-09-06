"use server";
import { db } from "@/db";
import { holdings, portfolio, transactions } from "@/db/schema";
import { auth } from "@/lib/auth";
import { and, eq, sql } from "drizzle-orm";
import { headers } from "next/headers";

export const sellAsset = async (_previousState: unknown, data: FormData) => {
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

    //add sale to balance
    await db
      .update(portfolio)
      .set({
        balance: sql`${portfolio.balance} + ${total}`,
        updatedAt: new Date(),
      })
      .where(eq(portfolio.id, userPortfolio.id));

    //create transaction
    await db.insert(transactions).values({
      portfolioId: userPortfolio.id,
      type: "sell",
      amountUsd: total.toFixed(2),
      symbol: symbol,
      price: price.toFixed(2),
      quantity: quantity.toFixed(8),
    });

    //subtract from holdings

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
      return { error: "The asset you selected does not exist" };
    }

    await db
      .update(holdings)
      .set({
        quantity: sql`${holdings.quantity} - ${quantity}`,
      })
      .where(eq(holdings.id, existingHolding.id));

    return { success: true };
  } catch (error) {
    return { error: "Failed to sell asset" };
  }
};
