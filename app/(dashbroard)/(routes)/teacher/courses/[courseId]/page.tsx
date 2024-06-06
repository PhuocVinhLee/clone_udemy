import { getCoursById } from "@/lib/actions/courses.action";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
const coursesId = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();
  const course = await getCoursById(params.courseId);
  if (!userId) return redirect("/");
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
    </div>
  );
};

export default coursesId;
