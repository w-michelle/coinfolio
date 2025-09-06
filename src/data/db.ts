"use server";
import { db } from "@/db";
import { portfolio } from "@/db/schema";
import { authClient } from "@/lib/auth-client";

export async function createPortfolio() {
  const { data: session } = await authClient.getSession();

  if (!session) {
    throw new Error("User not authenticated");
  }

  const userId = session?.user.id;
  try {
    await db.insert(portfolio).values({
      userId: userId,
      balance: "0",
    });
  } catch (error) {
    console.error("Failed to create portfolio");
  }
}
