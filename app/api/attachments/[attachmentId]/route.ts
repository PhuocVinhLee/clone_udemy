import { deleteAttachments } from "@/lib/actions/acttachments.action";
import Attachments from "@/lib/database/models/attachments.model";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,{params}: {params: {attachmentId: string}}
) {
  try {
    const { userId } = auth();
    const {attachmentId} = params;
    // const payload = await req.json();
   
    // console.log("payload",payload);
    if (!userId) return new NextResponse("UnAuthention", { status: 401 });
    // const DataAttachment = {
    //   _id: attachmentId
    // };

    const acttachment = await deleteAttachments(attachmentId);
    console.log(acttachment)
    return NextResponse.json(acttachment);
  } catch (error) {
    console.log(error);
    return new NextResponse("Inter Error In Attachments", { status: 500 });
  }
}
