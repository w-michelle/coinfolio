"use server";
import { headers } from "next/headers";
import { auth } from "./../../lib/auth";
import { db } from "@/db";
import { eq, sql } from "drizzle-orm";
import { portfolio, transactions } from "@/db/schema";
import { revalidatePath } from "next/cache";

export const withdrawMoney = async (
  _previousState: unknown,
  data: FormData
) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    return { error: "User not authenticated" };
  }

  try {
    const formData = Object.fromEntries(data);
    const amount = Number(formData.amount);

    const [userPortfolio] = await db
      .select()
      .from(portfolio)
      .where(eq(portfolio.userId, session.user.id));

    if (!userPortfolio) {
      return { error: "Portfolio not found" };
    }

    if (Number(userPortfolio.balance) < amount) {
      return { error: "Insufficient balance to complete this withdrawl." };
    }

    await db.insert(transactions).values({
      portfolioId: userPortfolio.id,
      type: "withdraw",
      amountUsd: amount.toFixed(2),
    });

    await db
      .update(portfolio)
      .set({
        balance: sql`${portfolio.balance} - ${amount}`,
        updatedAt: new Date(),
      })
      .where(eq(portfolio.id, userPortfolio.id));

    revalidatePath("/transactions/transfers");
    return { success: true };
  } catch (error) {
    return { error: "Failed to withdraw money." };
  }
};
