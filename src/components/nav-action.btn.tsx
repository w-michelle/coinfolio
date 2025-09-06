"use client";

import React, { useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { FaAngleRight } from "react-icons/fa6";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import Link from "next/link";

interface UserProp {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null | undefined | undefined;
}

export const NavActionBtn = ({ user }: { user: UserProp }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`rounded-full p-[6px] bg-cgray transition-colors cursor-pointer hover:bg-white hover:text-black`}
      >
        <IoAddOutline size="23" />
      </div>
      {isOpen && (
        <div className="absolute top-10 -left-20 mt-2 rounded-md text-neutral-600 text-sm truncate bg-white p-4">
          {/* Add Money */}
          <Link href="/transactions/transfers">
            <div className="flex items-center justify-between gap-2 hover:font-bold cursor-pointer">
              <RiMoneyDollarCircleLine />
              <p>Add/Withdraw</p>
              <span>
                <FaAngleRight />
              </span>
            </div>
          </Link>

          <hr className="my-2 border-neutral-400 "></hr>
          {/* buy */}
          <Link href="/transactions/trade">
            <div className="flex items-center justify-between hover:font-bold cursor-pointer">
              <p>Buy/Sell</p>
              <span>
                <FaAngleRight />
              </span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};
