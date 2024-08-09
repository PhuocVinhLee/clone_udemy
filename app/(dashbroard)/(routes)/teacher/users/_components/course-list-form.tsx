"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

import { Combobox } from "@/components/ui/combobox";

interface UserListFormProps {
  initialData: {
    courseId: string;
  };
  options: { label: string; value: string }[];
  onChange: (value: string) => {};
}

export const CourseListForm = ({
  initialData,
  onChange,
  options,
}: UserListFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((current) => !current);
  const router = useRouter();

  // const seclectedOption = options.find(
  //   (option) => option.value === initialData?.categoryId
  // );
  console.log(initialData);
  return (
    <div className="mt-6 broder  dark:bg-slate-700 bg-slate-100 rounded-md p-4">
      <div className=" font-medium flex items-center justify-between">
        Course category
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Scanel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2"></Pencil>
              Edit category
            </>
          )}
        </Button>
      </div>

      {isEditing && (
        <Combobox
          options={options}
          value={initialData.courseId}
          onChange={onChange}
        />
      )}
    </div>
  );
};
