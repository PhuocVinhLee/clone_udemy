/* eslint-disable camelcase */

import Purchase from "@/lib/database/models/purchase.model";
import { NextResponse } from "next/server";
import stripe, { Stripe } from "stripe";

export async function POST(request: Request) {
  const body = await request.text();

  const sig = request.headers.get("stripe-signature") as string;

  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.log("Post erorrr");
    return NextResponse.json({ message: "Webhook error", error: err });
  }

  // Get the ID and type
  const eventType = event.type;

  // CREATE
  if (eventType === "checkout.session.completed") {
   // const { id, amount_total, metadata } = event.data.object;

    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session?.metadata?.userId;
    const courseId = session?.metadata?.courseId;
    
    console.log ( "userId and courseId",userId + " " + courseId)
    if (!userId || !courseId) {
      
      return new NextResponse(`Wedhook Error: Missing metadata`, {
        status: 400,
      });
    }
    const newTransaction = await Purchase.create({
      courseId: courseId,
      userId: userId,
      createdAt: new Date(),
    });
    return NextResponse.json({ message: "OK", transaction: newTransaction });
  } else {
    
    return new NextResponse("Wedhook Error: Unhandel event type", {
      status: 200,
    });
  }
}
