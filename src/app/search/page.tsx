"use client";
import React, { useState, useEffect } from "react";
import { Roboto_Mono } from "next/font/google";
import { Roboto_Serif } from "next/font/google";
import { cn } from "@/libs/utils";
import Image from "next/image";
import Arrow from "@/components/Arrow";
import axios from "axios";
import { useRouter } from "next/navigation";

const sans = Roboto_Serif({ subsets: ["latin"] });
const roboto = Roboto_Mono({ subsets: ["latin"] });

export default function Page() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();
  const fetchItems = async (query: string) => {
    setLoading(true);
    try {
      const movieEndpoint = query
        ? `https://api.themoviedb.org/3/search/movie?api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${query}&sort_by=popularity.desc`
        : `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.NEXT_PUBLIC_API_KEY}&sort_by=popularity.desc`;

      const tvEndpoint = query
        ? `https://api.themoviedb.org/3/search/tv?api_key=${process.env.NEXT_PUBLIC_API_KEY}&query=${query}&sort_by=popularity.desc`
        : `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.NEXT_PUBLIC_API_KEY}&sort_by=popularity.desc`;

      const [moviesResponse, tvResponse] = await Promise.all([
        axios.get(movieEndpoint),
        axios.get(tvEndpoint),
      ]);
      const combinedResults: any = [
        ...moviesResponse.data.results,
        ...tvResponse.data.results,
      ].sort(() => Math.random() - 0.5);

      setItems(combinedResults);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems("");
  }, []);

  useEffect(() => {
    if (searchQuery.length >= 3) {
      fetchItems(searchQuery);
      setIsSearching(true);
    } else {
      fetchItems("");
      setIsSearching(false);
    }
  }, [searchQuery]);

  return (
    <div className="w-full h-full overflow-hidden items-center pt-10 md:pl-[85px] flex flex-col">
      <div className="">
        <input
          className={cn(
            roboto.className,
            "rounded-lg w-[350px] h-[48px] bg-black text-[13px] px-3 placeholder:text-[12px] placeholder:text-[#5c6065] outline-none text-[#ffc31e]"
          )}
          placeholder="please enter at least 3 characters to search ....."
          type="text"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="pt-5 flex items-center space-x-2 pl-5 md:pl-0 w-full h-full">
        <h1 className={cn(sans, "md:pl-10 p-2 text-[20px] md:text-[25px]")}>
          Top Searches
        </h1>
        <h1
          className={cn("font-bold text-[#ffc31e] text-[20px] md:text-[25px]")}
        >
          today
        </h1>
      </div>
      <div className="flex flex-wrap items-start justify-start pl-5 md:pl-0  mt-5 w-full h-full">
        {loading
          ? Array.from({ length: 18 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col mr-10 mb-12 max-w-[150px] max-h-[278px]"
              >
                <div className="flex min-h-[250px] min-w-[150px] rounded shimmer"></div>
                <p className={cn(roboto.className, "truncate  ")}>Loading...</p>
              </div>
            ))
          : items.slice(0, 18).map((item: any) => (
              <div
                key={item.id}
                className="flex flex-col md:mr-10 mx-2 md:mb-12 mb-6 md:max-w-[150px] max-w-[100px]  md:max-h-[278px]"
              >
                <div
                  onClick={() =>
                    router.push(
                      `/details?id=${item.id}&type=${
                        item.title ? "movie" : "tv"
                      }`
                    )
                  }
                  className="flex md:min-h-[250px] md:min-w-[150px]"
                >
                  <Image
                    className="object-cover rounded"
                    src={`https://image.tmdb.org/t/p/w500${
                      item.poster_path ? item.poster_path : item.backdrop_path
                    }`}
                    width={1920}
                    height={1080}
                    alt={item.title || item.name}
                  />
                </div>
                <p className={cn(roboto.className, "truncate mt-1")}>
                  {item.title || item.name}{" "}
                </p>
              </div>
            ))}
      </div>
    </div>
  );
}
