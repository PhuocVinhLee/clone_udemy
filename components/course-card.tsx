import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IconBadge } from "./icon-badge";
import { BookOpen, Star, StarIcon, User, Users } from "lucide-react";
import { formatPrice } from "@/lib/format";
import CourseProgress from "./course-progress";

interface CourseCardProps {
  _id: string;
  title: string;
  imageUrl: string;
  price: number;
  category?: string;
  progress: number | null;
  chaptersLength?: number;
  averageStart?: number | null;
  numberStudents?: number | null;
  mode?: boolean
}

const CourseCard = ({
  _id,
  title,
  imageUrl,
  price,
  category,
  progress,
  chaptersLength,
  averageStart,
  numberStudents,
  mode
}: CourseCardProps) => {
  console.log("pro", progress);
  return (
    <Link href={`/courses/${_id}`}>
      <div className=" group  hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        <div className=" relative aspect-video w-full rounded-md  overflow-hidden">
          <Image
            fill
            className="object-cover"
            alt={title}
            src={imageUrl}
          ></Image>
        </div>
        <div className="flex flex-col pt-2 gap-y-2">
          <div className=" text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>

          <p className=" text-sx text-muted-foreground  font-light">
            {category}
          </p>
          <div className=" my-3 flex items gap-x-2  text-sm md:text-xs items-center justify-between">
            <div className=" flex items-center gap-x-1  text-slate-500">
              <IconBadge size="sm" icon={BookOpen}></IconBadge>
              <span>{chaptersLength} Chapters </span>
            </div>
            { mode && (  averageStart ? (
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => {
                  const isFullStar = index + 1 <= Math.floor(averageStart);
                  const isHalfStar =
                    index + 1 > Math.floor(averageStart) &&
                    index < averageStart;

                  return (
                    <div key={index} className="relative">
                      <Star
                        className={`w-5 h-5 ${
                          isFullStar ? "text-yellow-500" : "text-gray-300"
                        }`}
                        fill={isFullStar ? "#ffd700" : "none"}
                      />
                      {isHalfStar && (
                        <Star
                          className="w-5 h-5 text-yellow-500 absolute inset-0"
                          style={{ clipPath: "inset(0 50% 0 0)" }}
                          fill="#ffd700"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => {
                  return (
                    <div key={index} className="relative">
                      <Star className={`w-5 h-5 ${"text-gray-300"}`} />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
           { mode && <div className=" flex items-center justify-between">
            <p className=" text-md md:text-sm font-medium ">
              {formatPrice(price)}
            </p>
            <div className="flex gap-x-1">
              <Users className="w-5 h-5"></Users>

              {numberStudents}
            </div>
          </div>}

          {progress !== null && (
            <CourseProgress
              variant={progress == 100 ? "success" : "default"}
              size="sm"
              value={progress}
            ></CourseProgress>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
