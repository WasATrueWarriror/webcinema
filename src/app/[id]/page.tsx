"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { cn } from "@/libs/utils";
import { Roboto_Mono } from "next/font/google";
import Arrow from "@/components/Arrow";
import { FilterX } from "lucide-react";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";

const roboto = Roboto_Mono({ subsets: ["latin"] });

function Page(params: any) {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | "">("");
  const [count, setCount] = useState(1);
  const [type, setType] = useState("now_playing");
  const router = useRouter();

  const data = (() => {
    switch (params.params.id) {
      case "movie":
        return `movie/${type}?`;
      case "tv":
        return `tv/${type === "now_playing" ? "airing_today" : type}?`;
      case "anime":
        return type === "now_playing"
          ? "discover/movie?with_genres=16&"
          : "discover/tv?&with_genres=16&";
      case "kdrama":
        return type === "now_playing"
          ? "discover/movie?with_origin_country=KR&"
          : "discover/tv?with_origin_country=KR&";
      default:
        return "";
    }
  })();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/${data}api_key=21adfad015207a4c85a59b73ff60ddec&page=${count}`
        );

        setMovies(response.data.results);
      } catch (err: any) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [data, count]);

  const renderSortOptions = () => {
    if (params.params.id === "anime" || params.params.id === "kdrama") {
      return (
        <>
          <h1
            onClick={() => setType("now_playing")}
            className={cn(
              type === "  now_playing" ? "text-[#FFB800]" : "",
              roboto.className,
              ""
            )}
          >
            Movie
          </h1>
          <h1
            onClick={() => setType("popular")}
            className={cn(
              type === "popular" ? "text-[#FFB800]" : "",
              roboto.className,
              ""
            )}
          >
            Show
          </h1>
        </>
      );
    } else {
      return (
        <>
          <h1
            onClick={() => setType("now_playing")}
            className={cn(
              type === "now_playing" ? "text-[#FFB800]" : "",
              roboto.className,
              ""
            )}
          >
            Latest
          </h1>
          <h1
            onClick={() => setType("popular")}
            className={cn(
              type === "popular" ? "text-[#FFB800]" : "",
              roboto.className,
              ""
            )}
          >
            Trending
          </h1>
          <h1
            onClick={() => setType("top_rated")}
            className={cn(
              type === "top_rated" ? "text-[#FFB800]" : "",
              roboto.className,
              ""
            )}
          >
            Top-Rated
          </h1>
        </>
      );
    }
  };

  if (["movie", "tv", "anime", "kdrama"].includes(params.params.id)) {
    return (
      <div className="w-full pl-[100px] p-5 flex flex-col h-full">
        <div className="flex pb-5">
          <h1 className={cn("font-bold text-[25px] pb-3")}>
            {params.params.id}
          </h1>
        </div>
        <div className="flex flex-row pb-5 justify-between">
          <div className="flex space-x-5">{renderSortOptions()}</div>
          <div className="flex items-center">
            <h1 className={cn(roboto.className, "")}>Filter</h1>
            <FilterX className="text-[#A4B3C9] w-4 h-4" />
          </div>
        </div>

        <div className="flex flex-wrap items-center mt-10 w-full h-full">
          {loading
            ? Array.from({ length: 18 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col mr-10 mb-12 max-w-[150px] max-h-[278px]"
                >
                  <div className="flex min-h-[250px] min-w-[150px] rounded shimmer"></div>
                  <p className={cn(roboto.className, "truncate")}>Loading...</p>
                </div>
              ))
            : movies.slice(0, 18).map((item: any) => (
                <div
                  key={item.id}
                  className="flex flex-col mr-10 mb-12 max-w-[150px] max-h-[278px]"
                >
                  <div
                    onClick={() =>
                      router.push(
                        `/details?id=${item.id}&type=${
                          item.title ? "movie" : "tv"
                        }`
                      )
                    }
                    className="flex  min-h-[250px] min-w-[150px]"
                  >
                    <Image
                      className="object-cover rounded"
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                      width={1920}
                      height={1080}
                      alt={item.title || item.name}
                    />
                  </div>
                  <p className={cn(roboto.className, "truncate")}>
                    {item.title || item.name}
                  </p>
                </div>
              ))}
        </div>
        <Arrow count={count} setCount={setCount} />
      </div>
    );
  } else {
    return notFound();
  }
}

export default Page;
