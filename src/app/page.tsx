"use client";
import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Roboto_Mono } from "next/font/google";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import axios from "axios";
import { cn } from "@/libs/utils";
import { useRouter } from "next/navigation";
import ImageHeader from "@/components/Mainpage/ImageHeader";

const roboto = Roboto_Mono({ subsets: ["latin"] });

export default function Homepage() {
  const router = useRouter();
  const maindata = [
    {
      id: 0,
      name: "Recommendation",
      url: "https://api.themoviedb.org/3/movie/now_playing?api_key=21adfad015207a4c85a59b73ff60ddec&language=en-US&page=1",
    },
    {
      id: 1,
      name: "Latest Movies",
      url: "https://api.themoviedb.org/3/discover/movie?api_key=21adfad015207a4c85a59b73ff60ddec&primary_release_date.gte=2024-08-01&primary_release_date.lte=2024-08-31&page=1",
    },
    {
      id: 2,
      name: "Latest TV-Shows",
      url: "https://api.themoviedb.org/3/discover/tv?api_key=21adfad015207a4c85a59b73ff60ddec&first_air_date.gte=2024-08-01&first_air_date.lte=2024-08-31&page=1",
    },
    {
      id: 3,
      name: "Latest K-Drama",
      url: "https://api.themoviedb.org/3/trending/all/day?api_key=21adfad015207a4c85a59b73ff60ddec",
    },
    {
      id: 4,
      name: "Popular K-Drama",
      url: "https://api.themoviedb.org/3/trending/all/day?api_key=21adfad015207a4c85a59b73ff60ddec",
    },
    {
      id: 5,
      name: "Latest Anime",
      url: "https://api.themoviedb.org/3/trending/all/day?api_key=21adfad015207a4c85a59b73ff60ddec",
    },
    {
      id: 6,
      name: "Popular Anime",
      url: "https://api.themoviedb.org/3/trending/all/day?api_key=21adfad015207a4c85a59b73ff60ddec",
    },
    {
      id: 7,
      name: "Popular Movies",
      url: "https://api.themoviedb.org/3/movie/popular?api_key=21adfad015207a4c85a59b73ff60ddec&language=en-US&page=1",
    },
    {
      id: 8,
      name: "Popular TV-Shows",
      url: "https://api.themoviedb.org/3/tv/popular?api_key=21adfad015207a4c85a59b73ff60ddec&language=en-US&page=1",
    },
  ];

  const [moviesData, setMoviesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const [sliderRef, slider] = useKeenSlider({
    slides: {
      perView: 8,
      spacing: 15,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allData = await Promise.all(
          maindata.map(async (item) => {
            const response = await axios.get(item.url);
            return { name: item.name, data: response.data.results };
          })
        );
        setMoviesData(allData);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full h-full pl-[70px]">
      <ImageHeader />
      {loading ? (
        maindata.map((item, idx) => (
          <div key={idx} className="pl-1 w-full h-full">
            <div className="pb-[40px] pt-[40px]">
              <div className="flex flex-row items-center justify-between">
                <h1 className={cn("text-[25px] pb-3")}>{item.name}</h1>
                <div className="flex flex-row items-center pr-2 justify-center">
                  <ChevronLeft className="text-[#A4B3C9] w-5 h-5" />
                  <p
                    className={cn(
                      roboto.className,
                      "text-[#A4B3C9] text-[12px]"
                    )}
                  >
                    swipe
                  </p>
                  <ChevronRight className="text-[#A4B3C9] w-5 h-5" />
                </div>
              </div>
              <div className="keen-slider overflow-x-auto h-[270px]">
                {Array.from({ length: 18 }).map((_, index) => (
                  <div
                    key={index}
                    className="keen-slider__slide shimmer !min-w-[200px]"
                  >
                    <p className={cn(roboto.className, "truncate")}></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      ) : error ? (
        <p>Error fetching data: {error.message}</p>
      ) : (
        moviesData.map((item, idx) => (
          <div key={idx} className="pl-1 w-full h-full">
            <div className="pb-[40px] pt-[40px]">
              <div className="flex flex-row items-center justify-between">
                <h1 className={cn("text-[25px] pb-3")}>{item.name}</h1>
                <div className="flex flex-row items-center pr-2 justify-center">
                  <ChevronLeft className="text-[#A4B3C9] w-5 h-5" />
                  <p
                    className={cn(
                      roboto.className,
                      "text-[#A4B3C9] text-[12px]"
                    )}
                  >
                    swipe
                  </p>
                  <ChevronRight className="text-[#A4B3C9] w-5 h-5" />
                </div>
              </div>
              <div
                ref={sliderRef}
                className="keen-slider overflow-x-auto h-[270px]"
              >
                {item.data.map((movie: any) => (
                  <div
                    onClick={() =>
                      router.push(
                        `/details?id=${movie.id}&type=${
                          movie.name ? "tv" : "movie"
                        }`
                      )
                    }
                    key={movie.id}
                    className="keen-slider__slide !min-w-[200px]"
                  >
                    <Image
                      className="object-cover h-[250px] rounded"
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.name || movie.title}
                      width={1920}
                      height={1080}
                    />
                    <p className={cn(roboto.className, "truncate")}>
                      {movie.name || movie.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
