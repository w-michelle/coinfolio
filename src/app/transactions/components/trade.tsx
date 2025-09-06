"use client";

import { useState } from "react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { portfolioOptions, topListOptions } from "@/data/queries";
import Link from "next/link";
import { BuyForm } from "./buyForm";
import { SellForm } from "./sellForm";

export const Trade = ({ id }: { id: string }) => {
  const [selected, setSelected] = useState("buy");

  const { data } = useQuery(portfolioOptions(id));
  console.log("data:", data);
  const {
    data: {
      Data: { LIST: cryptoList },
    },
  } = useSuspenseQuery(topListOptions);

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
            onClick={() => setSelected("buy")}
            className={`border-1 ${
              selected === "buy"
                ? "border-x-1 bg-neutral-300 text-black"
                : "border-r-0 text-neutral-600 "
            } border-b-0 border-cgray rounded-md p-2 cursor-pointer`}
          >
            BUY
          </button>
          <button
            onClick={() => setSelected("sell")}
            className={`border-1 ${
              selected === "sell"
                ? "border-x-1 bg-white text-black"
                : "border-l-0 text-neutral-600"
            } border-b-0 rounded-md  border-cgray p-2 cursor-pointer`}
          >
            SELL
          </button>
        </div>

        <div className="border-1 border-cgray p-8">
          {data ? (
            selected === "buy" ? (
              <BuyForm
                data={data}
                list={cryptoList}
              />
            ) : (
              <SellForm
                data={data}
                list={cryptoList}
              />
            )
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
};
