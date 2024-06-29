import { stripe } from "@/lib/actions/stripe.action";
import { getUserById } from "@/lib/actions/user.actions";
import Courses from "@/lib/database/models/courses.model";
import Purchase from "@/lib/database/models/purchase.model";
import StripeCustomer from "@/lib/database/models/stripCustomer.model";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await currentUser();
    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const userFromDataBase = await getUserById(user.id);
    if (!userFromDataBase) {
      throw new Error("User not found");
    }

    const course = await Courses.findOne({
      _id: params.courseId,
      isPublished: true,
    });
    const purchase = await Purchase.findOne({
      userId: userFromDataBase._id,
      courseId: params.courseId,
    });

    if (purchase) {
      return new NextResponse("Already purchase", { status: 400 });
    }
    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: course.title,
            description: course.description!,
          },
          unit_amount: Math.round(course.price! * 100),
        },
      },
    ];

    let stripeCustomer = await StripeCustomer.findOne(
      { userId: userFromDataBase._id },
      "stripCustomerId"
    );
    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        email: user.emailAddresses[0].emailAddress,
      });
      stripeCustomer = await StripeCustomer.create({
        userId: userFromDataBase._id,
        stripeCustomerId: customer.id,
      });

    }
    const session = await stripe.checkout.sessions.create({
        line_items,
        metadata: {
          courseId: course._id?.toString(),
          userId: userFromDataBase?._id.toString()
        },
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/courses/${course._id?.toString()}?success=1`,
        cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/courses/${course._id?.toString()}?canceled=1`,
      })
      return  NextResponse.json({url: session.url})



  } catch (error) {
    console.log("some thing went wrong in API checkout", error);
    return new NextResponse("Internal server error");
  }
}
