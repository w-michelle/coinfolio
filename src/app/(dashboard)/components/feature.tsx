import Image from "next/image";
import Link from "next/link";
import React from "react";
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

const Feature = ({ featured }: { featured: NewsArticle }) => {
  return (
    <div className="col-start-2 col-span-2 row-start-1 bg-black px-4 py-8 border-1 border-cgray rounded-sm">
      <article className="mx-4 flex flex-col gap-4">
        <h2 className="font-bold ">Featured</h2>
        <figure className="relative w-3/4 aspect-16/9">
          <Image
            src={featured.IMAGE_URL}
            alt="feature news image"
            className="object-cover"
            fill
          />
        </figure>
        <Link
          href={featured.URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <h1 className="">{featured.TITLE}</h1>
        </Link>
        <p className="text-xs text-neutral-300 tracking-wider">
          {convertToTime(featured.CREATED_ON)}
        </p>
      </article>
    </div>
  );
};

export default Feature;
