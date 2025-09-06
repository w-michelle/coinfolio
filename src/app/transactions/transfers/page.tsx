import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Transfer } from "../components/transfer";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getQueryClient } from "@/lib/query-client";
import { portfolioOptions } from "@/data/queries";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/sign-in");
  }
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(portfolioOptions(session.user.id));

  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Transfer id={session.user.id} />
      </HydrationBoundary>
    </div>
  );
};

export default Page;
