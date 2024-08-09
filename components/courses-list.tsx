import React from "react";
import CourseCard from "./course-card";
import { CategoryType } from "@/lib/database/models/categorys.model";
import { ChapterType } from "@/lib/database/models/chapters.model";

type CoursesWithProgressWithCategory = {
  _id: string;
  // courseId: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  isPublished: boolean;
  category: CategoryType;
  progress: number | null;
  averageStart?: number| null;
  numberStudents?: number|null;
  chapters: { _id: string }[];
};

interface CoursesListProps {
  items: CoursesWithProgressWithCategory[];
  mode?: boolean
}
function CoursesList({ items , mode}: CoursesListProps) {
  return (
    <div>
      <div className=" grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items.map((item) => {
          return (
            <CourseCard
              key={item._id}
              _id={item._id}
              title={item.title}
              imageUrl={item.imageUrl}
              chaptersLength={item?.chapters.length}
              price={item.price}
              progress={item.progress}
              category={item?.category?.name}
              averageStart={item?.averageStart}
              numberStudents ={item?.numberStudents}
              mode={mode}
            ></CourseCard>
          );
        })}
      </div>

      {items.length === 0 && (
        <div className=" text-center text-sm text-muted-foreground mt-10">
          No courses found
        </div>
      )}
    </div>
  );
}

export default CoursesList;
