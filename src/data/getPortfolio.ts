"use server";

import { db } from "@/db";
import { portfolio } from "./../db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function getPortfolio() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  try {
    const data = await db.query.portfolio.findFirst({
      where: eq(portfolio.userId, session.user.id),
      with: {
        holdings: true,
        transactions: true,
      },
    });
    return data;
  } catch (error) {
    throw new Error("Could not get portfolio");
  }
}
