"use server";
import { db } from "@/db";
import { portfolio } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import React from "react";

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
    const symbol = formData.symbol;

    const [userPortfolio] = await db
      .select()
      .from(portfolio)
      .where(eq(portfolio.userId, session.user.id));

    if (!userPortfolio) {
      return { error: "Portfolio not found" };
    }
  } catch (error) {
    return { error: "Failed to buy asset" };
  }
};
