import { getUserById } from "@/lib/actions/user.actions";
import Courses from "@/lib/database/models/courses.model";
import Purchase from "@/lib/database/models/purchase.model";
import User from "@/lib/database/models/user.model";
import { connectToDatabase } from "@/lib/database/mongoose";
import { auth } from "@clerk/nextjs/server";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId } = params;

    if (!userId) return new NextResponse("UnAuthention", { status: 401 });
    await connectToDatabase();

    const user = await getUserById(userId);
    if (!user) {
      return new NextResponse("User not found", { status: 401 });
    }

    const courseToGet = await Courses.findById(courseId);

    if (!courseToGet || courseToGet?.userId.toHexString() !== user._id) {
      throw new Error("Unauthorized or Course not found");
    }

    console.log(courseId);

    const ListUser = await Purchase.aggregate([
      { $match: { courseId: new mongoose.Types.ObjectId(courseId) } },
      {
        $lookup: {
          from: "users", // Ensure this matches your actual collection name
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          userDetails: 1, // Include all fields from userDetails
          createdAt: 1, // Include the createdAt field from the Purchase collection
        },
      }, // This projects the userDetails as the top-level field
    ]);

    console.log(ListUser);
    const ListUserMap = ListUser.map((user) => {
      return { ...user.userDetails, createdAt: user.createdAt };
    });
    return NextResponse.json(ListUserMap);
  } catch (error) {
    return new NextResponse("Inter Error", { status: 500 });
  }
}
