// // pages/api/courses/[courseId]/vnpay/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import crypto from "crypto";
// import qs from "querystring"; // Use 'querystring' for simpler query string handling
// import { format } from "date-fns";

// const vnpayConfig = {
//   vnp_TmnCode: process.env.VNP_TMNCODE || "",
//   vnp_HashSecret: process.env.VNP_HASHSECRET || "",
//   vnp_Url: process.env.VNP_URL || "",
//   vnp_ReturnUrl: process.env.VNP_RETURNURL || "",
// };

// export async function POST(req: NextRequest) {
//   try {
//     const ipAddr = "127.0.0.1"; // Placeholder for actual IP address retrieval

//     const body = await req.json();
//     const { amount, bankCode, orderDescription, orderType, language } = body;

//     const date = new Date();
//     const createDate = format(date, "yyyyMMddHHmmss");
//     const orderId = format(date, "HHmmss");

//     const locale = language || "vn";
//     const currCode = "VND";
//     let vnp_Params: any = {
//       vnp_Version: "2.1.0",
//       vnp_Command: "pay",
//       vnp_TmnCode: vnpayConfig.vnp_TmnCode,
//       vnp_Locale: locale,
//       vnp_CurrCode: currCode,
//       vnp_TxnRef: orderId,
//       vnp_OrderInfo: orderDescription,
//       vnp_OrderType: orderType,
//       vnp_Amount: amount * 100,
//       vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
//       vnp_IpAddr: ipAddr,
//       vnp_CreateDate: createDate,
//     };

//     if (bankCode) {
//       vnp_Params.vnp_BankCode = bankCode;
//     }

//     // Sort parameters alphabetically
//     const sortedParams = Object.fromEntries(Object.entries(vnp_Params).sort());

//     // Create the secure hash using HMAC SHA512
//     const signData = qs.stringify(sortedParams);
//     console.log("Signature Data:", signData);

//     const hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
//     const secureHash = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

//     // Add secure hash to parameters
//     sortedParams["vnp_SecureHash"] = secureHash;
//     const vnpUrl = `${vnpayConfig.vnp_Url}?${qs.stringify(sortedParams, )}`;

//     // Debugging
//     console.log("vnpUrl", vnpUrl);
//     console.log("Parameters:", sortedParams);
//     console.log("Generated Signature:", secureHash);

//     return NextResponse.json({ url: vnpUrl });
//   } catch (error) {
//     console.error("Error generating VNPay URL:", error);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// }
