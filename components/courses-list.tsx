import React from "react";
import CourseCard from "./course-card";

type CoursesWithProgressWithCategory = {
  _id: string;
  courseId: string;
  title: string | null;
  description: string | null;
  imageUrl: string | null;
  price: number | null;
  isPublished: boolean | null;
  category: { name: string; _id: string } | null;
  progress: number | null;
  chapters: { _id: string }[] | null;
};

interface CoursesListProps {
  items: CoursesWithProgressWithCategory[];
}
function CoursesList({ items }: CoursesListProps) {
  return (
    <div>

   
    <div className=" grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {items.map((item) => {
        return <CourseCard key={item._id} _id={item._id} title={item.title} imageUrl={item.imageUrl} chaptersLength={CoursesList.length
            
        } price={item.price} progress={item.progress} category={item?.category?.name}></CourseCard>
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
