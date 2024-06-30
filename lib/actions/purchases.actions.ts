"use server";

import { revalidatePath } from "next/cache";

import Purchase from "../database/models/purchase.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import { getUserById } from "./user.actions";
import mongoose from "mongoose";

// CREATE

// READ
export async function getPurchaseByUserIdAndCourseId(
  courseId: string,
  userId: string
) {
  console.log("adlndlnldnalndlan",userId + courseId)
  try {
    await connectToDatabase();
    const user = await getUserById(userId);
    if (!user) {
      throw new Error("User not found");
      return null;
    }

    console.log(userId + courseId)
    const purchase = await Purchase.findOne({
      userId: (user._id),
      courseId: new mongoose.Types.ObjectId(courseId),
    });

    if (!purchase) throw new Error("Purchase not found");

    return JSON.parse(JSON.stringify(purchase));
  } catch (error) {
    // handleError(error);
    console.log("An in erorr in get purchase ", error);
    return null;
  }
}

// UPDATE

// DELETE
export async function deletePurchase(clerkId: string) {
  try {
    await connectToDatabase();

    // Find purchase to delete
    const purchaseToDelete = await Purchase.findOne({ clerkId });

    if (!purchaseToDelete) {
      throw new Error("Purchase not found");
    }

    // Delete purchase
    const deletedPurchase = await Purchase.findByIdAndDelete(
      purchaseToDelete._id
    );
    revalidatePath("/");

    return deletedPurchase ? JSON.parse(JSON.stringify(deletedPurchase)) : null;
  } catch (error) {
    handleError(error);
  }
}

// USE CREDITS
export async function updateCredits(purchaseId: string, creditFee: number) {
  try {
    await connectToDatabase();

    const updatedPurchaseCredits = await Purchase.findOneAndUpdate(
      { _id: purchaseId },
      { $inc: { creditBalance: creditFee } },
      { new: true }
    );

    if (!updatedPurchaseCredits)
      throw new Error("Purchase credits update failed");

    return JSON.parse(JSON.stringify(updatedPurchaseCredits));
  } catch (error) {
    handleError(error);
  }
}
