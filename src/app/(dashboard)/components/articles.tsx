import React from "react";

import { FaArrowCircleUp, FaArrowCircleDown } from "react-icons/fa";
import { MdOutlineRemoveCircle } from "react-icons/md";
import { convertToTime } from "../../../../utils/formatDateTime";

interface NewsArticle {
  ID: string;
  TITLE: string;
  BODY: string;
  IMAGE_URL: string;
  URL: string;
  SENTIMENT: string;
  CREATED_ON: number;
}

const Articles = ({ news }: { news: NewsArticle[] }) => {
  return (
    <div
      className="col-span-1 row-span-2 h-full overflow-y-scroll border-cgray bg-black px-8 py-8 border-1  rounded-sm [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-neutral-900
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-neutral-700"
    >
      <div className="flex items-center gap-4">
        <h3>Today</h3>
        <div className="my-2 border-t-1 border-cwhite w-full"></div>
      </div>
      <section>
        {news.slice(1, news.length).map((item: NewsArticle) => (
          <div
            key={item.ID}
            className="mt-4 flex flex-col gap-4"
          >
            <p className="mt-2 text-xs tracking-widest text-neutral-400">
              {convertToTime(item.CREATED_ON)}
            </p>
            <p className="text-xs text-neutral-400 flex items-center gap-1 tracking-wider">
              {item.SENTIMENT === "POSITIVE" ? (
                <FaArrowCircleUp className="text-green-700" />
              ) : item.SENTIMENT === "NEGATIVE" ? (
                <FaArrowCircleDown className="text-rose-800" />
              ) : (
                <MdOutlineRemoveCircle className="text-neutral-600" />
              )}
              {item.SENTIMENT.slice(0, 1).toUpperCase() +
                item.SENTIMENT.slice(1).toLowerCase()}
            </p>
            <div>
              <h2 className="mb-1">{item.TITLE}</h2>
              <p className="mb-2 line-clamp-2 text-neutral-400 text-sm">
                {item.BODY}
              </p>
            </div>
            <hr className="text-neutral-400" />
          </div>
        ))}
      </section>
    </div>
  );
};

export default Articles;
