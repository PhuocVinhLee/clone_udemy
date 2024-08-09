import { getAllCategory } from "@/lib/actions/categorys.action";
import Categories from "./_components/Categories";
import SearchInput from "@/components/search-input";
import { auth } from "@clerk/nextjs/server";
import { ActionGetAllCoursesRefProgressRefCategory } from "@/lib/actions/courses.action";
import { redirect } from "next/navigation";
import CoursesList from "@/components/courses-list";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}


const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = auth();
  if(!userId) redirect("/")
  const ArrCategories = await getAllCategory();

  const courses = await  ActionGetAllCoursesRefProgressRefCategory({userId, ...searchParams})
  console.log("course in Search",courses)

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput ></SearchInput>
      </div>

      <div className="p-6 space-y-4">

        <Categories items={ArrCategories}></Categories>

        <CoursesList mode={true} items={courses}>

        </CoursesList> 
      </div>
    </>
  );
};

export default SearchPage;
