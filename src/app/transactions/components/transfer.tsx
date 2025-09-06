"use client";

import { useState } from "react";
import { DepositForm } from "./depositForm";
import { WithdrawForm } from "./withdrawForm";
import { useQuery } from "@tanstack/react-query";
import { portfolioOptions } from "@/data/queries";
import Link from "next/link";

export const Transfer = ({ id }: { id: string }) => {
  const [selected, setSelected] = useState("deposit");

  const { data } = useQuery(portfolioOptions(id));

  return (
    <div className="min-h-svh flex flex-col items-center justify-center">
      <Link
        href="/"
        className="self-start ml-8 mb-4 bg-cgray text-white py-2 px-4 hover:bg-white hover:text-black hover:cursor-pointer"
      >
        Back to Dashboard
      </Link>
      <div className=" m-4 w-full max-w-sm md:max-w-md">
        <div className="flex">
          <button
            onClick={() => setSelected("deposit")}
            className={`border-1 ${
              selected === "deposit"
                ? "border-x-1 bg-neutral-300 text-black"
                : "border-r-0 text-neutral-600 "
            } border-b-0 border-cgray rounded-md p-2 cursor-pointer`}
          >
            DEPOSIT
          </button>
          <button
            onClick={() => setSelected("withdraw")}
            className={`border-1 ${
              selected === "withdraw"
                ? "border-x-1 bg-white text-black"
                : "border-l-0 text-neutral-600"
            } border-b-0 rounded-md  border-cgray p-2 cursor-pointer`}
          >
            WITHDRAW
          </button>
        </div>

        <div className="border-1 border-cgray p-8">
          {data ? (
            selected === "deposit" ? (
              <DepositForm data={data} />
            ) : (
              <WithdrawForm data={data} />
            )
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
};
