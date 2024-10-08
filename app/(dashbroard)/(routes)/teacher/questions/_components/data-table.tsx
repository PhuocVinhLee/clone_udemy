"use client";

import {
  ColumnDef,
  flexRender,
  SortingState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ChevronDown, PlusCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleExport } from "@/components/excell/export-to-excell";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import { QuestionTypeType } from "@/lib/database/models/questionTypes.model";
import { CategoryType } from "@/lib/database/models/categorys.model";
import { QuestionChapterType } from "@/lib/database/models/questionschapter.model";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  setQuestionsFromRoot: any;
}
const exportTemplateExcell: unknown = {
  _id: "example_id",
  __v: 0,
  position: 1,

  title: "Example Title",
  description: "Example Description",
  imageUrl: "http://example.com/image.png",
  answer: "Example Answer",
  questionType: "Function c",
  template: "Example Template",
  category: "Engineering",
  testCases: JSON.stringify([
    {
      input: "Example Input",
      output: "Example Output",
      asexample: true,
      position: 1,
    },
  ]),
  level: "easy",
};

export function DataTable<TData, TValue>({
  columns,
  data,
  setQuestionsFromRoot,
}: // setQuestionsFromRoot
DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,

      rowSelection,
    },
  });
  const [filterValue, setFilterValue] = React.useState("");

  {
    console.log(table.getFilteredSelectedRowModel());
  }
  const selectedRows = table.getSelectedRowModel().rows;
  useEffect(() => {
    setQuestionsFromRoot(selectedRows);
  }, [selectedRows]);

  return (
    <div className="w-full">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center py-4">
        <div
          className="
        flex gap-x-3"
        >
          <Input
            placeholder="Filter title..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Link href={`/teacher/create-question`}>
            {" "}
            <Button variant="outline">
              {" "}
            
              New a question{" "}
            </Button>{" "}
          </Link>
          <Link href={`/teacher/questions/import-excell`}>
            {" "}
            <Button variant="outline">
              {" "}
             
              Import from excell
            </Button>{" "}
          </Link>

          <Button
            disabled={!data}
            onClick={() => {
              const questions = selectedRows.map((q: any) => {
                return q?.original;
              });
              if (data.length) {
                if (!questions.length) {
                  toast.error("Please select a question!");
                } else {
                  return handleExport({
                    data: questions,
                    fileName: "rootquestions.xlsx",
                  });
                }
              }
            }}
            variant="outline"
          >
            Export to excell
          </Button>

          <Button
            onClick={() => {
              handleExport({
                data: [exportTemplateExcell as QuestionChapterType],
              });
            }}
            variant="outline"
          >
            Export template excell
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
