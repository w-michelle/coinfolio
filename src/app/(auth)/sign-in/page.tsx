import SignInView from "@/components/auth/signin-view";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!!session) {
    redirect("/");
  }
  return (
    <div>
      <SignInView />
    </div>
  );
};

export default Page;
