import React from "react";
interface PortfolioProps {
  id: number;
  userId: string;
  balance: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}
const Balance = ({ data }: { data: PortfolioProps }) => {
  return (
    <div className="col-span-1 bg-black px-8 py-8 border-1 border-cgray rounded-sm">
      <h2 className="font-bold">Balance</h2>
      <div className="flex items-center justify-center h-[10vh]">
        <p className="text-3xl">${data.balance}</p>
      </div>
    </div>
  );
};

export default Balance;
