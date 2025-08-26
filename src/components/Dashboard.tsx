"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React from "react";

const Dashboard = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  if (!session) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <div>Dashboard</div>
      <p>Logged in as {session.user.name}</p>
      <button
        onClick={() =>
          authClient.signOut({
            fetchOptions: { onSuccess: () => router.push("/sign-in") },
          })
        }
        className="bg-black text-white w-full"
      >
        Sign Out
      </button>
    </div>
  );
};

export default Dashboard;
