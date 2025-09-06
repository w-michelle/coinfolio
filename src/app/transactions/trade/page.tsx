import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getQueryClient } from "@/lib/query-client";
import { portfolioOptions, topListOptions } from "@/data/queries";
import { Trade } from "../components/trade";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/sign-in");
  }
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(portfolioOptions(session.user.id));
  await queryClient.prefetchQuery(topListOptions);

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Trade id={session.user.id} />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
