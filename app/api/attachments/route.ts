import { createAttachments } from "@/lib/actions/acttachments.action";
import Attachments from "@/lib/database/models/attachments.model";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request
) {
  try {
    const { userId } = auth();
    
    const payload = await req.json();
    // const body = JSON.stringify(payload);
    console.log("payload",payload);
    if (!userId) return new NextResponse("UnAuthention", { status: 401 });
    const DataAttachment = {
      name: payload?.url?.split("/").pop(),
      url: payload?.url,
      courseId: payload?.courseId,
    };

    const acttachment = await createAttachments(DataAttachment);
    return NextResponse.json(acttachment);
  } catch (error) {
    console.log(error);
    return new NextResponse("Inter Error In Attachments", { status: 500 });
  }
}
