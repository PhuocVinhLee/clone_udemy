// pages/api/hackerearth.ts

import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  req: Request,
  { params }: { params: { he_id: string } }
) {
  try {

    //"https://api.hackerearth.com/v4/partner/code-evaluation/submissions/bb0248f7-7693-4309-a84b-75d9a258dc22/"
    console.log("start get");
    const { he_id } = params;
    const response = await axios.get(
      `https://api.hackerearth.com/v4/partner/code-evaluation/submissions/${he_id}`,

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
