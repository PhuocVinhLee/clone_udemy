// pages/api/hackerearth.ts

import ejs from 'ejs';

import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from "next/server";
import axios from 'axios';
import { renderedTemplate } from '@/lib/actions/renderedTemplate.action';


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
export  async function POST(req: Request, res: Response) {
 
  



    try {
      const { testCases, lang, answer ,template} = await  req.json(); 
    const STUDENT_ANSWER = `
    // Student's code here
    printf("Hello World!");
  `;



 

  const source = ejs.render(template, {
    ANSWER: answer,
    TESTCASE: testCases,
  });
  
 return NextResponse.json(source);
  
      const response = await axios.post(
        'https://api.hackerearth.com/v4/partner/code-evaluation/submissions/',
        {
          source,
          lang,
          time_limit: 5,
          memory_limit: 262144,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'client-secret': process.env.NEXT_PUBLIC_HE_CLIENT_SECRET,
          },
        }
      );

      console.log("respone", response)
      return NextResponse.json(response.data);
    } catch (error) {
        console.log("Eorr",error)
        return new NextResponse("Internal Error", { status: 500 });
    }

}



