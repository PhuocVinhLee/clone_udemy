"use client";

import React from "react";
import * as XLSX from "xlsx";

import { QuestionChapterType } from "@/lib/database/models/questionschapter.model";

interface TestCase {
  input: string;
  output: string;
}

interface ExportProps {
  data: (QuestionChapterType & { __v?: number })[];
  fileName?: string; // Name of the exported file
}

export const handleExport = ({ data, fileName }: ExportProps) => {
  try {
    // Process the data to handle `null`, values and include test cases as a JSON string
    const transformedData = data.map((item) => {
      const {
        _id,
        userId,
        __v,
        position,
        chapterId,
        isPublished,
        questionTypeId,
        createdAt,
        updatedAt,
        ...rest
      } = item;

      return {
        ...rest,
        testCases: item.testCases ? JSON.stringify(item.testCases) : "", // Serialize testCase array to JSON string
      };
    });

    // Create a worksheet from the transformed data
    const worksheet = XLSX.utils.json_to_sheet(transformedData);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    // Export the workbook to an Excel file
    XLSX.writeFile(workbook, fileName ? fileName: "data.xlsx");
  } catch (error) {
    console.error("Error exporting to Excel:", error);
  }
};
