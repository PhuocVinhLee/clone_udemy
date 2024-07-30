"use server";
import { connectToDatabase } from "../database/mongoose";

import QandA from "../database/models/qanda.model";
import { getUserById } from "./user.actions";
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
export async function getAllMessagByChapterId(
  chapterId: string,
  userId: string
) {
  try {
    await connectToDatabase();
    const user = await getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const qandas = await QandA.find({
      chapterId: chapterId,
      root: true,
    })
      .sort({ createdAt: -1 })
      .populate("userId", "_id username photo role"); // Specify the fields you want to include from the Chapters model
    const qandasWithRelays = [];

    // Iterate over each root QandA document
    const YourComments = [];

    for (const qanda of qandas) {
      // Count the number of related QandA documents
      const relayCount = await QandA.countDocuments({
        rootId: qanda._id,
        root: false,
      });
      const qandaWithRelay = qanda.toObject();
      qandaWithRelay.length_of_relay = relayCount;

      console.log("userId", user);
      console.log("userId2", qandaWithRelay.userId._id);
      if (user._id  === qandaWithRelay.userId._id.toHexString()) {
        YourComments.push(qandaWithRelay);
      } else {
        qandasWithRelays.push(qandaWithRelay);
      }
    }
console.log("al mess aseee", [...YourComments, ...qandasWithRelays])
   
    return JSON.parse(JSON.stringify([...YourComments, ...qandasWithRelays]));
  } catch (error) {
    //handleError(error);

    console.log(" An error in action get all allMessage ;", error);
    return [];
  }
}

// GET ONE
