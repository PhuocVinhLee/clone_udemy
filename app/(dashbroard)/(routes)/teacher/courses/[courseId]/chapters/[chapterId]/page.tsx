"use server";
// import { auth } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getChapterById } from "@/lib/actions/chapter.action";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { ChapterTitleForm } from "./_components/chapter-title-form";
import { ChapterDescriptionForm } from "./_components/chapter-description-form";
import { ChapterAccessForm } from "./_components/chapter-access-form";
const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth(); // because this component in Server=> use auth() not getAuth()
  console.log("chapterId UserId", userId);
  //  if (!userId) redirect("/");
  const chapter = await getChapterById(params.chapterId);
  if (!chapter) return redirect("/");

  const requiredFlieds = [chapter.title, chapter.description, chapter.videoUrl];
  const totalFields = requiredFlieds.length;
  const completedFields = requiredFlieds.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <div>userId{userId}</div>
          <Link
            href={`/teacher/courses/${params.courseId}`}
            className="flex items-center text-sm hover:opacity-75 transition mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2"></ArrowLeft>
            Back to course set up
          </Link>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Chapter Creation</h1>
              <span className="tex-sm text-slate-700">
                Complete all all fileds {completionText}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid  grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className=" space-y-4">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard}></IconBadge>
              <h2 className=" text-xl">Custom your chapter</h2>
            </div>
            <ChapterTitleForm
              initialData={chapter}
              chapterId={params.chapterId}
              courseId={params.courseId}
            ></ChapterTitleForm>
            <ChapterDescriptionForm
              initialData={chapter}
              chapterId={params.chapterId}
              courseId={params.courseId}
            ></ChapterDescriptionForm>
          </div>

          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Eye}></IconBadge>
              <h2 className=" text-xl">Access Settings</h2>
            </div>
            <ChapterAccessForm
              initialData={chapter}
              chapterId={params.chapterId}
              courseId={params.courseId}
            ></ChapterAccessForm>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChapterIdPage;
