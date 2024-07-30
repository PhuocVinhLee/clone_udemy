import { auth, currentUser } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import {
  createMuxdata,
  deleteMuxdataByChapterId,
  deleteMuxdta,
  getMuxdataByChapterId,
} from "@/lib/actions/muxdata.action";

import Courses from "@/lib/database/models/courses.model";
import { connectToDatabase } from "@/lib/database/mongoose";
import Chapters from "@/lib/database/models/chapters.model";
import { getUserById } from "@/lib/actions/user.actions";
import QandA from "@/lib/database/models/qanda.model";

export async function PATCH(
  req: Request,
  { params }: { params: { seenId: string } }
) {
  try {
    const { userId } = auth();
    const current_User = await currentUser();
    if (!userId) {
      return new NextResponse("UnAuthention in Update Chapter", {
        status: 401,
      });
    }
    const { seenId } = params;

    await connectToDatabase();
    const user = await getUserById(userId);
    if (!user) {
      return new NextResponse("User not found", { status: 401 });
    }

    const DataQandA = {
      seen: true,
    };

    const message = await QandA.findByIdAndUpdate(seenId, DataQandA, {
      new: false,
    });

    return NextResponse.json(message);
  } catch (error) {
    console.log("erorr in Seen Q and A", error);
    return new NextResponse("Inter Error", { status: 500 });
  }
}
