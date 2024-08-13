import { auth, currentUser } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import { connectToDatabase } from "@/lib/database/mongoose";

import { getUserById } from "@/lib/actions/user.actions";
import QandA from "@/lib/database/models/qanda.model";
import { pusherServer } from "@/lib/pusher";
import User from "@/lib/database/models/user.model";
import { createNotification } from "@/lib/actions/notification.action";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: {
      courseId: string;
      chapterId: string;
      rootId: string;
      replayId: string;
    };
  }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("UnAuthention in Update Chapter", {
        status: 401,
      });
    }
    const current_User = await currentUser();
    const { chapterId, rootId, replayId, courseId } = params;
    const payload = await req.json();

    const isTeacher = current_User?.publicMetadata?.role === "teacher";

    await connectToDatabase();
    const user = await getUserById(userId);
    if (!user) {
      return new NextResponse("User not found", { status: 401 });
    }
    const replayMessage = await QandA.findById(replayId);
    if (!replayMessage || !rootId) {
      return new NextResponse("Message not found", { status: 302 });
    }

    const DataQandA = {
      courseId: courseId,
      chapterId: chapterId,
      // name: current_User?.username,
      message: payload?.message,
      userId: user._id,
      replayId: replayId,
      //isTeacher: isTeacher,
      //urlAvatar: current_User?.imageUrl,
      root: false,
      rootId: rootId,
      // nameUserReplay: replayMessage.name,
      userIdReplay: replayMessage.userId,
      createdAt: new Date(),
    };

    const message = await QandA.create(DataQandA);
    const userReplay = await User.findById(message.userIdReplay).select(
      "username role photo _id"
    );
    // const userOwner = await User.findById(message.userId).select(
    //   "username role photo _id"
    // );
    //const chapter = await  Chapters.findById(message.chapterId).select("_id title videoUrl")

    const notification = await createNotification({
      userId: user._id,
      userIdReceve: replayMessage.userId,
      chapterId: chapterId,
      courseId: courseId,
      id_message: message._id,
      type: "REPLAY:QANDA",
      title: "Replay a question",
      message: payload?.message,
      createdAt: new Date(),
    });

    await pusherServer.trigger(
      userReplay.username,
      "notification:new",
      notification
    );

    return NextResponse.json(message);
  } catch (error) {
    console.log("erorr in Update chapter", error);
    return new NextResponse("Inter Error", { status: 500 });
  }
}

// export async function GET(
//   req: Request,
//   { params }: { params: { rootId: string; replayId: string } }
// ) {
//   try {
//     const { userId } = auth();
   
//     if (!userId) {
//       return new NextResponse("UnAuthention", {
//         status: 401,
//       });
//     }
//     const current_User = await currentUser();
//     const { rootId, replayId } = params;;

//     console.log(current_User);
//     const isTeacher = current_User?.publicMetadata?.role === "teacher";

//     await connectToDatabase();
//     const user = await getUserById(userId);
//     if (!user) {
//       return new NextResponse("User not found", { status: 401 });
//     }
//     const showMoreMessage = await QandA.find({
//       root: false,
//       rootId: rootId,
//     })
//       .sort({ createdAt: -1 })
//       .populate("userId", "username photo role") // Specify the fields you want to include from the Chapters model
//       .populate("userIdReplay", "username photo role")
//       .exec();
//     if (!showMoreMessage) {
//       return new NextResponse("ShowMoreMessage not found", { status: 401 });
//     }

//     //console.log(".sort({ createdAt: 1 })",showMoreMessage )
//     return NextResponse.json(showMoreMessage);
//   } catch (error) {
//     console.log("erorr in Update chapter", error);
//     return new NextResponse("Inter Error", { status: 500 });
//   }
// }
