import { Button } from '@/components/ui/button'
import React from 'react'
import { Badge } from "@/components/ui/badge"
import { QuestionType } from '@/lib/database/models/questions.model'


interface QuestionInforProp{
  question: QuestionType;
}
const QuestionInfor = ({question}: QuestionInforProp) => {
  return (
    <div className='px-2 py-2'>
      <div className='flex gap-x-2 flex-wrap'>
      <p className=' text-sm flex'>
       {question?.title}
       </p>
       <Badge className='  bg-yellow-400'  variant="outline">Medium</Badge>
      </div>

    </div>
  )
}

export default QuestionInfor
