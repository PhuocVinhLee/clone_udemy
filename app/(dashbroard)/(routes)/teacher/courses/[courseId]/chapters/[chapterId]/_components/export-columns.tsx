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
import { useState } from "react";
import ExpandableCell from "../../../../../../../../../components/data-table/expandable-cell";
import ExpandableImage from "../../../../../../../../../components/data-table/expandable-image ";
import { TestCaseType } from "@/lib/database/models/questions.model";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type Question = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  answer: string;
  questionType: string;
  template: string;
  testCases: {
    input: string;
    output: string;
    asexample: boolean;
    position: number;
  }[];
  
  level: string;
};

export const ExportColumns: ColumnDef<Question>[] = [
  // type course
  {
    id: "select",
    header: ({ table }) => {
     
     
      return (
        <Checkbox
          
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
    accessorKey: "questionType",
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
];
