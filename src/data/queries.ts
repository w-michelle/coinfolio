import { queryOptions } from "@tanstack/react-query";
import { getPortfolio } from "./getPortfolio";

export const newsOptions = queryOptions({
  queryKey: ["news"],
  queryFn: async () => {
    const response = await fetch(
      `https://data-api.coindesk.com/news/v1/article/list?lang=EN&limit=10&api_key=${process.env.COINDESK_TOKEN}`
    );
    const data = await response.json();

    return data;
  },
});

export const topListOptions = queryOptions({
  queryKey: ["top"],
  queryFn: async () => {
    const response = await fetch(
      `https://data-api.coindesk.com/asset/v1/top/list?page=1&page_size=10&sort_by=CIRCULATING_MKT_CAP_USD&sort_direction=DESC&groups=ID,BASIC,SUPPLY,PRICE,MKT_CAP,VOLUME,CHANGE,TOPLIST_RANK&toplist_quote_asset=USD&api_key=${process.env.COINDESK_TOKEN}`
    );
    const data = await response.json();
    return data;
  },
});

export const portfolioOptions = (userId: string) => ({
  queryKey: ["portfolio", userId],
  queryFn: getPortfolio,
});
