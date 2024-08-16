"use client";
import dynamic from "next/dynamic";
import { useMemo } from "react";

import "react-quill/dist/quill.bubble.css";
interface ReviewProps {
  value: string;
}
export const Review = ({ value }: ReviewProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
  return (
    <ReactQuill
      theme="bubble"
      value={value}
      readOnly
      className=" quill-content "
    ></ReactQuill>
  );
};
