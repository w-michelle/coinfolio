"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { DashboardUserButton } from "./dashboard-user-btn";
import { NavActionBtn } from "./nav-action.btn";

interface UserProp {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null | undefined | undefined;
}

const Navbar = ({ user }: { user: UserProp }) => {
  const [selected, setSelected] = useState("dashboard");

  return (
    <nav className="flex items-center justify-between mx-6 my-8 text-sm">
      <div className="bg-cgray rounded-l-full rounded-r-full px-6 py-2">
        <Image
          src="/coinLogo.png"
          alt="Logo"
          width={80}
          height={80}
        />
      </div>
      <div className="bg-cgray rounded-l-full rounded-r-full">
        <ul className="flex items-center justify-center">
          <li
            className={`rounded-full py-2 px-6 bg-cgray transition-colors cursor-pointer ${
              selected === "dashboard"
                ? "bg-white text-black font-bold"
                : "text-white"
            }`}
            onClick={() => setSelected("dashboard")}
          >
            <Link href="/">Dashboard</Link>
          </li>

          <li
            className={`rounded-full py-2 px-6 bg-cgray transition-colors cursor-pointer ${
              selected === "assets"
                ? "bg-white text-black font-bold"
                : "text-white"
            }`}
            onClick={() => setSelected("assets")}
          >
            {" "}
            <Link href="#">Assets </Link>
          </li>

          <li
            className={`rounded-full py-2 px-6 bg-cgray transition-colors cursor-pointer ${
              selected === "transactions"
                ? "bg-white text-black font-bold"
                : "text-white"
            }`}
            onClick={() => setSelected("transactions")}
          >
            {" "}
            <Link href="#">Transactions </Link>
          </li>
        </ul>
      </div>
      <div className="flex items-center gap-2">
        <DashboardUserButton user={user} />
        <NavActionBtn user={user} />
      </div>
    </nav>
  );
};

export default Navbar;
