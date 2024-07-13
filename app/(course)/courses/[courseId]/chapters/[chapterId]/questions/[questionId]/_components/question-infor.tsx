import { Button } from '@/components/ui/button'
import React from 'react'
import { Badge } from "@/components/ui/badge"


const QuestionInfor = () => {
  return (
    <div className='px-2 py-2'>
      <div className='flex gap-x-2 flex-wrap'>
      <p className=' text-sm flex'>
        Question 1. write to me plus 2 number ?
       </p>
       <Badge className='  bg-yellow-400'  variant="outline">Medium</Badge>
      </div>

    </div>
  )
}

export default QuestionInfor
