// pages/api/hackerearth.ts

import ejs from "ejs";

import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import axios from "axios";
import { renderedTemplate } from "@/lib/actions/renderedTemplate.action";
import User from "@/lib/database/models/user.model";
import { connectToDatabase } from "@/lib/database/mongoose";
import { getUserById } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import { use } from "react";

// interface TestCase {
//   testcode: string;
// }

// interface RequestBody {
//   studentAnswer: string;
//   testcases: TestCase[];
// }

// const template = `
// #include <stdlib.h>
// #include <ctype.h>
// #include <string.h>
// #include <stdbool.h>
// #include <math.h>
// #define SEPARATOR "#<ab@17943918#@>#"

// <%- STUDENT_ANSWER %>

// int main() {
//   <% testcases.forEach((testcase, index) => { %>
//     {
//       <%- testcase.testcode %>;
//     }
//     <% if (index < testcases.length - 1) { %>
//       printf("%s\\n", SEPARATOR);
//     <% } %>
//   <% }); %>
//   return 0;
// }
// `;
export async function POST(req: Request, res: Response) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("UnAuthention", {
        status: 401,
      });
    }
    await connectToDatabase();
    const user = await getUserById(userId);
    if (!user) {
      return new NextResponse("User not found", { status: 401 });
    }
    const { testCases, lang, answer, template } = await req.json();

    const source = ejs.render(template, {
      ANSWER: answer,
      TESTCASE: testCases,
    });
    if(user.creditBalance === 0 || user.creditBalance <= 0 ){
      return NextResponse.json(
        { error: 'Insufficient balance', success: false },
        { status: 400 } // Set the HTTP status code to 400 (Bad Request)
      );
    }

    const updateCreditBalance = await User.findByIdAndUpdate(user._id, {creditBalance: user.creditBalance - 1  })

    const response = await axios.post(
      "https://api.hackerearth.com/v4/partner/code-evaluation/submissions/",
      {
        source,
        lang,
        time_limit: 5,
        memory_limit: 262144,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "client-secret": process.env.NEXT_PUBLIC_HE_CLIENT_SECRET,
        },
      }
    );

    console.log("respone", response);
    return NextResponse.json(response.data);
  } catch (error) {
    console.log("Eorr", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
