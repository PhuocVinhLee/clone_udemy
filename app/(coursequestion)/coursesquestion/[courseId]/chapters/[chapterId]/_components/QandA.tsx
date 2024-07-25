"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const QandA = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Textarea value="" placeholder="Write your question" readOnly>

      </Textarea>
      <div className="flex justify-end">
      <Button>Submit</Button>
      </div>
    </div>
  )
}

export default QandA