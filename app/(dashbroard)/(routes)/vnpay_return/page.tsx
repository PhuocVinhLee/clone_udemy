"use client"
import { useRouter } from "next/router";
import crypto from "crypto";
import querystring from "query-string";
import { useEffect, useState } from "react";

export default function VnpayReturn() {
  const router = useRouter();
  const { query } = router;
  const [status, setStatus] = useState("Processing");

  useEffect(() => {
    if (query.vnp_SecureHash) {
      const secureHash = query.vnp_SecureHash;
      delete query.vnp_SecureHash;
      const signData = querystring.stringify(query);
      const hmac = crypto.createHmac(
        "sha512",
        process.env.VNPAY_HASH_SECRET || ""
      );
      const expectedHash = hmac
        .update(Buffer.from(signData, "utf-8"))
        .digest("hex");

      if (secureHash === expectedHash && query.vnp_ResponseCode === "00") {
        setStatus("Success");
      } else {
        setStatus("Failed");
      }
    }
  }, [query]);

  return (
    <div>
      <h1>Payment Status: {status}</h1>
      <p>Order ID: {query.vnp_TxnRef}</p>
    </div>
  );
}
