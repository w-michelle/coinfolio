import Dashboard from "@/components/Dashboard";
import Navbar from "@/components/Navbar";
import { newsOptions, portfolioOptions } from "@/data/queries";
import { auth } from "@/lib/auth";
import { getQueryClient } from "@/lib/query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(newsOptions);

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/sign-in");
  }
  await queryClient.prefetchQuery(portfolioOptions(session.user.id));
  return (
    <div className="h-screen flex flex-col p-[50px]">
      <Navbar user={session.user} />
      <h1 className="mx-6 text-2xl my-10 flex-0">
        Welcome back{" "}
        <span className="text-neutral-500">{session.user.name}</span>
      </h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="flex-1 overflow-hidden">
          <Dashboard id={session.user.id} />
        </div>
      </HydrationBoundary>
    </div>
  );
};

export default Page;
