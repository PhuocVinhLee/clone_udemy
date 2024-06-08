import { IconBadge } from "@/components/icon-badge";
import { getCoursById } from "@/lib/actions/courses.action";
import { auth } from "@clerk/nextjs/server";
import { LayoutDashboard } from "lucide-react";
import { redirect } from "next/navigation";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";

const coursesId = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();
  const course = await getCoursById(params.courseId);
  //if (!userId) return redirect("/");
  if (!course) return redirect("/");
  console.log("couse", course);
  const requiredFlieds = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.caterogyId,
  ];
  const totalFields = requiredFlieds.length;
  const completedFields = requiredFlieds.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className=" flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">Courses setup</h1>
          <span>Completed all fields {completionText}</span>
        </div>
      </div>

      <div className=" grid  grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard}></IconBadge>
            <h2 className="text-xl">Custom your course</h2>
          </div>  

          <TitleForm initialData={course} courseId={course._id}></TitleForm>
          <DescriptionForm initialData={course} courseId={course._id}></DescriptionForm>
        </div>
      </div>
    </div>
  );
};

export default coursesId;
