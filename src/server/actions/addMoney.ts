"use server";
import { db } from "@/db";
import { portfolio, transactions } from "./../../db/schema";

import { auth } from "@/lib/auth";
import { eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

//previous state is used for example if you need to return previousState + 1
//  w/e you put next to the action in useActionState so if you put 0 because you want to count it is used to track
export const addMoney = async (_previousState: unknown, data: FormData) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user.id) {
    return { error: "User not authenticated" };
  }

  try {
    const formData = Object.fromEntries(data);
    const amount = Number(formData.amount);

    console.log("form data", amount);

    const [userPortfolio] = await db
      .select()
      .from(portfolio)
      .where(eq(portfolio.userId, session.user.id));

    if (!userPortfolio) {
      return { error: "Porfolio not found." };
    }

    //insert transaction
    await db.insert(transactions).values({
      portfolioId: userPortfolio.id,
      type: "deposit",
      amountUsd: amount.toFixed(2),
    });

    //update portfolio balance

    await db
      .update(portfolio)
      .set({
        balance: sql`${portfolio.balance} + ${amount}`,
        updatedAt: new Date(),
      })
      .where(eq(portfolio.id, userPortfolio.id));

    revalidatePath("/transactions/transfers");

    return { success: true };
  } catch (error) {
    return { error: "Failed to deposit money." };
  }
};
