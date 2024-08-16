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
import React, { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import axios from "axios";
// Ensure you have this component

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  // initialData: TData[]; // Initial data to populate the table
  options: Array<{ label: string; value: string }> | null; // Options for Combobox
  courses: {
    _id: string;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    categoryId: string;
    isPublished: boolean;
    createdAt: Date
  }[] | null;
}

export function DataTable<TData, TValue>({
  columns,
  options,
  courses,
}: DataTableProps<TData, TValue>) {
  const [data, setData] = useState<TData[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(
    options?.length ? options[0]?.value : null
  );

  const [isLoading, setIsLoading] = useState(false);
  const getUsers = async (id: string) => {
    try {
      setIsLoading(true);
      const respone = await axios.get(`/api/courses/${id}/user`);
      console.log("users", respone.data);
      setData(respone.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getUsers(options?.length ? options[0]?.value : " ");
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const handleComboboxChange = useCallback(async (value: string) => {
    setSelectedCourseId(value);

    // Fetch new data based on the combobox value
    const fetchData = async () => {
      getUsers(value);
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="flex items-center py-4 justify-between gap-x-4">
        <Input
          placeholder="Filter user..."
          value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div>
          <Combobox
            options={options?.length ? options: [] }
            value={selectedCourseId ? selectedCourseId: ""}
            onChange={handleComboboxChange}
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
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
