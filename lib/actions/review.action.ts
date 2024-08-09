"use server";
import { connectToDatabase } from "../database/mongoose";

import QandA from "../database/models/qanda.model";
import { getUserById } from "./user.actions";
import { Review } from "@/components/review";
import Reviews from "../database/models/review.model";
//import { handleError } from "../utils";

export async function getShowMoreMessage(rootId: string) {
  try {
    await connectToDatabase();

    const showMoreMessage = await QandA.find({
      root: false,
      rootId: rootId,
    });

    return JSON.parse(JSON.stringify(showMoreMessage));
  } catch (error) {
    //handleError(error);

    console.log(" An error in action get all allMessage ;", error);
    return [];
  }
}
export async function getAllReviewByChapterId(
  chapterId: string,
  userId: string
) {
  try {
    await connectToDatabase();
    const user = await getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const reviews = await Reviews.find({
      chapterId: chapterId,
      root: true,
    })
      .sort({ createdAt: -1 })
      .populate("userId", "_id username photo role"); // Specify the fields you want to include from the Chapters model
    const qandasWithRelays = [];

    // Iterate over each root QandA document
    const YourReviews = [];

    for (const review of reviews) {
      // Count the number of related QandA documents
      const relays = await Reviews.find({
        rootId: review._id,
        root: false,
      }) .sort({ createdAt: -1 })
      .populate("userId", "_id username photo role");
      
      const ReviewWithRelay = review.toObject();
      ReviewWithRelay.replayMessages = relays;

      
      if (user._id  === ReviewWithRelay.userId._id.toHexString()) {
        YourReviews.push(ReviewWithRelay);
      } else {
        qandasWithRelays.push(ReviewWithRelay);
      }
    }
console.log("al mess aseee", [...YourReviews, ...qandasWithRelays])
   
    return JSON.parse(JSON.stringify([...YourReviews, ...qandasWithRelays]));
  } catch (error) {
    //handleError(error);

    console.log(" An error in action get all Reviews ;", error);
    return [];
  }
}

// GET ONE
