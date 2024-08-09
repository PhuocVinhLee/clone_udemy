
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/database/mongoose";
import Categorys from "@/lib/database/models/categorys.model";



export async function GET() {
  try {
    await connectToDatabase();
    const category = await Categorys.find()
    console.log("skacbalsbclasbclk\n",category)
    return NextResponse.json(category);
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
