import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiUser } from "react-icons/fi";
import { IoIosLogOut } from "react-icons/io";

interface UserProp {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null | undefined | undefined;
}
export const DashboardUserButton = ({ user }: { user: UserProp }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const onLogOut = () => {
    authClient.signOut({
      fetchOptions: { onSuccess: () => router.push("/sign-in") },
    });
  };
  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer hover:bg-neutral-900 flex items-baseline gap-2 bg-cgray py-2 px-6 rounded-l-full rounded-r-full"
      >
        <FiUser />
        <p>Michi</p>
      </div>
      {isOpen && (
        <div className="absolute top-10 -left-1/2 mt-2 rounded-md text-neutral-600 text-sm truncate bg-white p-4">
          <p>{user.email}</p>
          <hr className="my-2 border-neutral-400"></hr>
          <button
            onClick={() => onLogOut()}
            className="flex items-center justify-between w-full hover:text-black cursor-pointer"
          >
            <span>Log Out</span>
            <IoIosLogOut />
          </button>
        </div>
      )}
    </div>
  );
};
