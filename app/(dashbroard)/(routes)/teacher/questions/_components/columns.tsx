"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { useEffect, useState } from "react";

import { TestCaseType } from "@/lib/database/models/questions.model";
import ExpandableCell from "@/components/data-table/expandable-cell";
import ExpandableImage from "@/components/data-table/expandable-image ";
import { QuestionTypeType } from "@/lib/database/models/questionTypes.model";
import axios from "axios";
import { CategoryType } from "@/lib/database/models/categorys.model";


export type Question = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  answer: string;
  questionTypeId: string;
  template: string;
  isPublished: boolean;
  categoryId: string;
  testCases: {
    input: string;
    output: string;
    asexample: boolean;
    position: number;
  }[];

  level: string;
};
// const [questionType, setQuestionType] = useState<QuestionTypeType[]>([]);
// const [category, setCategory] = useState<CategoryType[]>([]);
// const fechQuestionType = async () => {
//   const questionType = await axios.get(`/api/questiontype`);
//   setQuestionType(questionType.data);
// };
// const fechCategory = async () => {
//   const category = await axios.get(`/api/category`);
//   setCategory(category.data);
// };
// useEffect(() => {
//   fechCategory();
//   fechQuestionType();
// }, []);

export const columns: ColumnDef<Question>[] = [
  
  // type course
  {
    id: "select",
    header: ({ table }) => {
      const rows = table.getRowModel().rows;
      // const someExist = rows.some((row) => row.original.exist);
      // const allExist = rows.every((row) => row.original.exist);
      return (
        <Checkbox
          // disabled={someExist || allExist}
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      );
    },

    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const title: string = row.getValue("title");
      return <ExpandableCell text={title} />;
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Description
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const description: string = row.getValue("description");
      return <ExpandableCell text={description} />;
    },
  },
  {
    accessorKey: "imageUrl",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Image
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const photo: string = row.getValue("imageUrl");

      return (
        <ExpandableImage src={photo} alt="Description of the image" />
        //   <Image

        //   src={photo}
        //   width={50}
        //   height={50}
        //   alt="Picture of the author"
        // />
      );
    },
  },
  {
    accessorKey: "answer",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Answer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const answer: string = row.getValue("answer");
      return <ExpandableCell text={answer} />;
    },
  },

  {
    accessorKey: "template",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Template
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const template: string = row.getValue("template");
      return <ExpandableCell text={template} />;
    },
  },
  {
    accessorKey: "testCases",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          TestCases
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const testCases: TestCaseType[] = row.getValue("testCases");
      return (
        <ExpandableCell>
          <div>
            {testCases?.map((testcase, index) => {
              return (
                <div key={index} className="flex flex-col mb-3 ">
                  <div className="flex flex-col mb-3 gap-2">
                    <span className="flex gap-x-2 items-center justify-between">
                      Input:{" "}
                      <div className="bg-white  dark:bg-customDark w-full p-2">
                        {testcase.input}
                      </div>
                    </span>
                    <span className="flex gap-x-2 items-center justify-between">
                      Output:{" "}
                      <div className="bg-white  dark:bg-customDark w-full p-2">
                        {testcase.output}
                      </div>
                    </span>
                  </div>

                  <div className="flex  gap-x-1">
                    <Checkbox disabled={true} checked={testcase?.asexample} />
                    <div className="space-y-1 leading-none">
                      <div>Use as example.</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ExpandableCell>
      );
    },
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Published
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished") || false;
      return (
        <Badge className={cn("bg-slate-500", isPublished && "bg-sky-700")}>
          {isPublished ? "Published" : "Draft"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "questionTypeId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          QuestionType
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const questionType: string = row.getValue("questionTypeId");
      return <ExpandableCell text={   questionType} />;
    },

  },
  {
    accessorKey: "categoryId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const category: string = row.getValue("categoryId");
      return <ExpandableCell text={  category} />;
    },
  },

  {
    accessorKey: "level",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Level
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { _id } = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-4 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal></MoreHorizontal>{" "}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <Link href={`/teacher/questions/${_id}`}>
              <DropdownMenuItem>
                <Pencil className="h-4 w-4 mr-2"></Pencil> Edit
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
