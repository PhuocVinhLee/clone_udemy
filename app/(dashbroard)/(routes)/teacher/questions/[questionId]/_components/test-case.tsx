"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Pencil, SquarePlus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { TestCaseType } from "@/lib/database/models/questions.model";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { FormDescription, FormLabel } from "@/components/ui/form";

interface TestCaseProps {
  initialData: {
    testCases: TestCaseType[];
  };
  questionId: string;
}

export const TestCase = ({ initialData, questionId }: TestCaseProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  return (
    <div className="mt-6 broder bg-slate-100 rounded-md p-4">
      <div className=" font-medium flex items-center justify-between mb-4">
        Test cases
        <Link href={`/teacher/questions/${questionId}/code-testcases`}>
          {initialData?.testCases[0] ? (
            <span className="flex items-center justify-between gap-x-1">
              <Pencil className="h-4 w-4  "></Pencil>
              Edit
            </span>
          ) : (
            <span className="flex items-center justify-between gap-x-1">
              <SquarePlus className="h-4 w-4  "></SquarePlus>
              Add
            </span>
            // <Link href={`/teacher/questions/${questionId}/code-testcases`}>
            //  <div className="flex gap-x-1 items-center justify-between">
            //  <SquarePlus className="h-4 w-4  "></SquarePlus>
            //  Add
            //  </div>
            // </Link>
          )}
        </Link>
      </div>
      <span className=" text-sm ">
        {!initialData?.testCases[0] && <div className="w-full">Test case not found!</div> }
        {initialData?.testCases?.map((testcase, index) => {
          return (
            <div className="flex flex-col mb-4" key={index}>
              <div className="flex gap-2  items-center justify-between mb-3">
                <span>Case {index + 1}</span>

                <div className="flex  gap-x-1 " >
                  <Checkbox disabled={true} checked={testcase?.asexample} />
                  <div className="space-y-1 leading-none">
                    <div>Use as example.</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col mb-3 gap-2">
                <span className="flex gap-x-2 items-center justify-between">
                  Input:{" "}
                  <div className="bg-white w-full p-2">{testcase.input}</div>
                </span>
                <span className="flex gap-x-2 items-center justify-between">
                  Output:{" "}
                  <div className="bg-white w-full p-2">{testcase.output}</div>
                </span>
              </div>
              <div className="border-dashed border-2">

              </div>

            </div>
          );
        })}
      </span>
    </div>
  );
};
