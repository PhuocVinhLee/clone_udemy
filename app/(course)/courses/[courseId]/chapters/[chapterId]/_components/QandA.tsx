"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { QandQForm } from "./QandA-form";



interface QandAProps{
  chapterId: string;
  userId: string;
  courseId: string;
}

const QandA = ({chapterId, userId, courseId}: QandAProps) => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <QandQForm initialData={{message: ""}} userId={userId}  courseId={courseId} chapterId={chapterId}>

      </QandQForm>
      {/* <Textarea value="" placeholder="Write your question" readOnly>

      </Textarea>
      <div className="flex justify-end">
      <Button>Submit</Button>
      </div> */}
    </div>
  )
}

export default QandA