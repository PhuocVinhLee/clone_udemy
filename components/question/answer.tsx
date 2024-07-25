"use client";

import axios from "axios";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Pencil, SquarePlus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { FaRegAddressBook } from "react-icons/fa";
import { cn } from "@/lib/utils";
import CodeMirror from "@uiw/react-codemirror";
import { EditorState } from "@codemirror/state";
import { autocompletion } from "@codemirror/autocomplete";
import { cpp } from "@codemirror/lang-cpp";
import CodeMirrorCpn from "./code-testcases/code-mirror";

interface TitleFromProps {
  initialData: {
    answer: string;
  };
  questionId: string;

  link: string;
}

export const Answer = ({ initialData, questionId, link }: TitleFromProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  const [hiden, setHiden] = useState<boolean>(true);
  return (
    <div className="mt-6 broder  dark:bg-slate-700 bg-slate-100 rounded-md p-4">
      <div className=" font-medium flex items-center justify-between">
        Answer
        <div className="flex items-center gap-x-2">
          <div className="flex gap-x-2  items-center justify-between">
            <Checkbox
              checked={hiden}
              onCheckedChange={() => {
                setHiden((pre) => !pre);
              }}
            ></Checkbox>
            <span>Hiden</span>
          </div>
          <Link href={link}>
            {initialData?.answer ? (
              <span className="flex items-center justify-between gap-x-1">
                <Pencil className="h-4 w-4  "></Pencil>
                Edit
              </span>
            ) : (
              <span className="flex items-center justify-between gap-x-1">
                <SquarePlus className="h-4 w-4  "></SquarePlus>
                Add
              </span>
            )}
          </Link>
        </div>
      </div>

      <CodeMirrorCpn
        className={cn("  text-sm mt-2 w-full", hiden && " blur-sm")}
        valueProp={initialData?.answer}
       
        // extensions={[javascript({ jsx: true }),]}
        extensionsProp={[cpp(), EditorState.readOnly.of(true)]}
        //extensions={[cpp()]}
      />
    </div>
  );
};
