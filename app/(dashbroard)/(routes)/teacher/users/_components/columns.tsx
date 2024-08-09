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
import Image from 'next/image'
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type Course = {
  _id: string;
  username: string;
  email: string;
  photo: number;
  firstName: string;
  lastName: string;
  createdAt: Date
};

export const columns: ColumnDef<Course>[] = [
  // type course
  
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Username
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    accessorKey: "photo",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Photo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const photo : string =  (row.getValue("photo"));
     
      return (
        <Image
      
        src={photo}
        width={50}
        height={50}
        alt="Picture of the author"
      />
  
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Attend at
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const createdAt : Date =  (row.getValue("createdAt"));
      const formattedDate = new Date(createdAt).toLocaleString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      return (
        <div>
     { createdAt ?<p> {formattedDate}</p> : "None"}
    </div>
      )
    },
  },

  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const { _id } = row.original;
  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-4 w-4 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal></MoreHorizontal>{" "}
  //           </Button>
  //         </DropdownMenuTrigger>

  //         <DropdownMenuContent align="end">
  //           <Link href={`/teacher/courses/${_id}`}>
  //             <DropdownMenuItem>
  //               <Pencil className="h-4 w-4 mr-2"></Pencil> Edit
  //             </DropdownMenuItem>
  //           </Link>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];
