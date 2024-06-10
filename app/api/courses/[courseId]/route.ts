import { updateCourse } from "@/lib/actions/courses.action";
import Categorys from "@/lib/database/models/categorys.model";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH( req: Request, {params}: {params: {courseId: string}}){
    try {
        const {userId} = auth();
        const {courseId} = params;
        const payload = await req.json();
        // const body = JSON.stringify(payload);
        if(!userId) return  new NextResponse("UnAuthention", {status: 401});
        const DataCourse = {
            courseId: courseId,
            title: payload?.title,
            description: payload?.description,
            imageUrl: payload?.imageUrl,
            categoryId: payload?.categoryId
        
        }
      
          
         const course = await  updateCourse({course: DataCourse, userId});   
         return NextResponse.json(course);
         
    } catch (error) {
        return new NextResponse("Inter Error", {status: 500})
    }

}