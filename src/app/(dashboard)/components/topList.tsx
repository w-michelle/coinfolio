import { topListOptions } from "@/data/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
interface TopListProps {
  ID: number;
  NAME: string;
  PRICE_USD: number;
  SYMBOL: string;
  LOGO_URL: string;
}
const TopList = () => {
  const {
    data: {
      Data: { LIST: list },
    },
  } = useSuspenseQuery(topListOptions);

  console.log("list info:", list);

  return (
    <div
      className="col-start-2 col-span-2 row-start-2 bg-black px-6 py-8 border-1 border-cgray rounded-sm overflow-y-scroll [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-neutral-900
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-neutral-700"
    >
      <div>
        <h2 className="font-bold">Top List</h2>
        <ul className="flex flex-col gap-4 mt-4">
          {list.map((item: TopListProps) => (
            <li
              key={item.ID}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div>
                  <Image
                    src={item.LOGO_URL}
                    alt="asset logo"
                    width={30}
                    height={30}
                  />
                </div>
                <div>
                  <p className="font-bold">{item.SYMBOL}</p>
                  <p className="text-neutral-400">{item.NAME}</p>
                </div>
              </div>
              <p className="font-bold">
                ${parseFloat(item.PRICE_USD.toFixed(4))}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TopList;
