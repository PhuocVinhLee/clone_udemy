import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IconBadge } from "./icon-badge";
import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";
import CourseProgress from "./course-progress";



interface CourseCardProps {
  _id: string;
  title: string;
  imageUrl: string;
  price: number;
  category?: string;
  progress: number |null;
  chaptersLength: number;
}

const CourseCard = ({
  _id,
  title,
  imageUrl,
  price,
  category,
  progress,
  chaptersLength,
}: CourseCardProps) => {
  console.log("pro", progress)
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
        <div className="flex flex-col pt-2">
          <div className=" text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>

          <p className=" text-sx text-muted-foreground">{category}</p>
          <div className=" my-3 flex items gap-x-2 text-sm md:text-xs">
            <div className=" flex items-center gap-x-1  text-slate-500">
              <IconBadge size="sm" icon={BookOpen}></IconBadge>
              <span>{chaptersLength} Chapters</span>
            </div>
          </div>
  
          {progress !== null ? (
           <CourseProgress variant={progress == 100 ? "success" : "default"} size="sm" value={progress}>

           </CourseProgress>

           
          ) : (
            <p className=" text-md md:text-sm font-medium text-slate-700">
              {formatPrice(price)}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
