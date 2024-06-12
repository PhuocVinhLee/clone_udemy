import { IconBadge } from "@/components/icon-badge";
import { getCoursById } from "@/lib/actions/courses.action";
import { getAllCategory } from "@/lib/actions/categorys.action";
import { getAllAttachmentsByCourseId } from "@/lib/actions/acttachments.action";
import { getAllChapterByCourseId } from "@/lib/actions/chapter.action";
import { auth } from "@clerk/nextjs/server";
import { CircleDollarSign, LayoutDashboard, ListChecks, File } from "lucide-react";
import { redirect } from "next/navigation";
import { TitleForm } from "./_components/title-form";
import { ImageForm } from "./_components/image-form";
import { DescriptionForm } from "./_components/description-form";
import { ChapterForm } from "./_components/chapter-form";
import { CategoryForm } from "./_components/category-form";
import { PriceForm } from "./_components/price-form";
import { AttachmentForm } from "./_components/attachment-form";

const coursesId = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();
  const course = await getCoursById(params.courseId);
  const categorys = await getAllCategory();
  const attachments = await getAllAttachmentsByCourseId(params.courseId)
  const chapters = await getAllChapterByCourseId(params.courseId)
  console.log("chapters", chapters); console.log("userId",userId)
 
  //if (!userId) return redirect("/");
  if (!course) return redirect("/");
  console.log("couse", course);
  const requiredFlieds = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    course?.chapters?.some((chapter : any) => chapter.isPublished)
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
          <DescriptionForm
            initialData={course}
            courseId={course._id}
          ></DescriptionForm>
          <ImageForm initialData={course} courseId={course._id}></ImageForm>
          <CategoryForm
            initialData={course}
            courseId={course._id}
            options={categorys?.map(
              (category: { name: string; _id: string }) => ({
                label: category.name,
                value: category._id,
              })
            )}
          ></CategoryForm>
        </div>
        <div className=" space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks}></IconBadge>
              <h2 className="text-xl">Courses chapter</h2>
            </div>
            <ChapterForm
            initialData={{chapters: chapters}}
            courseId={course._id}
          ></ChapterForm>
          </div>

          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={CircleDollarSign}></IconBadge>
              <h2 className="text-xl">Sell your course</h2>
            </div>
            <PriceForm initialData={course} courseId={course._id}>

            </PriceForm>
          </div>

          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={File}></IconBadge>
              <h2 className="text-xl">Resources Attachments</h2>
            </div>
            <AttachmentForm initialData={{...course, attachments}} courseId={course._id}></AttachmentForm>
          </div>
        </div>
      </div>
    </div>
  );
};

export default coursesId;
