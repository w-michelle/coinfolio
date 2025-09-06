"use client";
import React, { useState } from "react";

interface HoldingProps {
  id: number;
  portfolioId: number;
  symbol: string;
  quantity: string | null;
  avgBuyPrice: string | null;
}

interface PortfolioProps {
  id: number;
  userId: string;
  balance: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  holdings: HoldingProps[];
}
interface CryptoListProps {
  ID: number;
  NAME: string;
  PRICE_USD: number;
  SYMBOL: string;
  LOGO_URL: string;
}
const PortfolioValue = ({
  data,
  list,
}: {
  data: PortfolioProps;
  list: CryptoListProps[];
}) => {
  const [holdings, setHoldings] = useState([]);

  const usersHoldings = data.holdings.map((item) => {
    const currentAsset = list.find((c) => c.SYMBOL === item.symbol);

    const quantity = Number(item.quantity ?? 0);
    const avgBuyPrice = Number(item.avgBuyPrice ?? 0);
    const currentPrice = currentAsset ? currentAsset.PRICE_USD : 0;

    const totalSpent = quantity * avgBuyPrice;
    const currentValue = quantity * currentPrice;
    const profit = currentValue - totalSpent;
    const profitPercentage = totalSpent > 0 ? (profit / totalSpent) * 100 : 0;

    return {
      symbol: item.symbol,
      quantity,
      avgBuyPrice,
      currentAsset,
      currentPrice,
      currentValue,
      profit,
      profitPercentage,
    };
  });

  const totalReturn = usersHoldings.reduce((acc, curr) => acc + curr.profit, 0);

  return (
    <div className="col-span-1 bg-black px-8 py-8 border-1 border-cgray rounded-sm">
      <h2 className="font-bold">Total Portfolio Value</h2>
      <div className="flex items-center justify-center h-[10vh]">
        <p className="text-3xl">${totalReturn.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default PortfolioValue;
