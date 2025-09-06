"use client";
import { newsOptions, portfolioOptions, topListOptions } from "@/data/queries";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import Feature from "@/app/(dashboard)/components/feature";
import Articles from "@/app/(dashboard)/components/articles";
import TopList from "@/app/(dashboard)/components/topList";
import Balance from "@/app/(dashboard)/components/balance";
import PortfolioValue from "@/app/(dashboard)/components/portfolioValue";

const Dashboard = ({ id }: { id: string }) => {
  const {
    data: { Data: news },
  } = useSuspenseQuery(newsOptions);

  const featured = news[0];

  const { data } = useQuery(portfolioOptions(id));
  const {
    data: {
      Data: { LIST: cryptoList },
    },
  } = useSuspenseQuery(topListOptions);
  return (
    <>
      <div className="w-full h-full px-6">
        <div className="grid grid-cols-4 grid-rows-[1fr] gap-2 h-full w-full">
          <Articles news={news} />
          <Feature featured={featured} />

          {data ? (
            <>
              <Balance data={data} />
              <PortfolioValue
                data={data}
                list={cryptoList}
              />
            </>
          ) : (
            <div>Loading...</div>
          )}

          <TopList />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
