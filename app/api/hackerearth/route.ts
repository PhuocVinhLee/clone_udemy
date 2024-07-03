// pages/api/hackerearth.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from "next/server";
import axios from 'axios';

export  async function POST(req: Request, res: Response) {
 
    const { source, lang, input, callback } = await  req.json();

    try {
        console.log("start",)
      const response = await axios.post(
        'https://api.hackerearth.com/v4/partner/code-evaluation/submissions/',
        {
          source,
          lang,
          input,
          time_limit: 5,
          memory_limit: 262144,
          callback,
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
