"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button"; // Replace with your UI components
import { Input } from "@/components/ui/input"; // Replace with your UI components
import ConfirmModal from "@/components/model/confirm-modal";
import { DataTable } from "./data-table";

import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";
import CourseProgress from "@/components/course-progress";

import FileUpload from "@/components/excell/file-upload";
import { ImportColumns } from "./import-columns";
import { CategoryType } from "@/lib/database/models/categorys.model";
import { QuestionTypeType } from "@/lib/database/models/questionTypes.model";
import { isBoolean } from "lodash";

interface ImportFromExcelProps {
  categorys: CategoryType[];
  questionTypes: QuestionTypeType[];
}

const ImportFromExcel = ({
  categorys,
  questionTypes,
}: ImportFromExcelProps) => {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle file upload and transformation
  const handleFileUpload = (file?: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryStr = event.target?.result;
        if (typeof binaryStr === "string") {
          const workbook = XLSX.read(binaryStr, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];

          // Convert sheet to JSON with headers
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          if (jsonData.length > 0) {
            // Extract headers from the first row
            const headers = jsonData[0] as string[];

            // Map remaining rows to objects using headers
            const transformedData = jsonData.slice(1).map((row: any) => {
              return headers.reduce((obj, header, index) => {
                obj[header] = row[index];
                return obj;
              }, {} as Record<string, any>);
            });

            // Set the transformed data to state
            const cleanData = transformedData?.map((data) => {
              if (data?.testCases) {
                const newTestCaeses = JSON.parse(data.testCases);

                return {
                  ...data,
                  testCases: newTestCaeses,
                };
              }
              return data;
            });
            setData(cleanData);
            console.log(transformedData);
            setIsModalOpen(true); // Open the modal after processing data
          }
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  // Handle confirmation
  const handleConfirm = async () => {
    await handelImportQuestion();
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const [isUpdating, setIsUpdating] = useState(false);
  const [questionsFromRoot, setQuestionsFromRoot] = useState([]);
  const [progress, setProgress] = useState(0);
  const handelImportQuestion = async () => {
    try {
      setProgress(0);
      setIsUpdating(true);

      const questions = questionsFromRoot
        .map((q: any) => {
          return q?.original;
        })
        ?.map((data) => {
          const categoryId = categorys.find(
            (category) => category.name === data.category
          );
          const questionTypeId = questionTypes.find(
            (questionType) => questionType.name === data.questionType
          );
          const { questionType, category, ...rest } = data;

          return {
            ...rest,
            categoryId,
            questionTypeId,
          };
        });
      if (!questions.length) {
        return toast.error("You don't have any question!");
      }

      const response = await axios.post(
        `/api/questions/arrayquestionschapter`,
        { arrayQuestion: questions },
        {
          onUploadProgress: (progressEvent) => {
            // Calculate the upload progress as a percentage
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress(percentCompleted);
            } else {
              // Handle the case where total is not defined (optional)
              setProgress(0);
            }
          },
        }
      );
      console.log("response", response);
      if (response?.data?.errors.length) {
        toast.success(
          "Question success, but a few question duplicate key error collection"
        );
      } else {
        toast.success(" Question success .");
      }

      setIsUpdating(false);
      setProgress(0);
      router.refresh();
      router.push(`/teacher/questions`);
    } catch (error) {
      toast.error("Some thing went wrong");
    } finally {
      setProgress(0);
      setIsUpdating(false);
    }
  };

  return (
    <div className=" relative">
      {isUpdating && (
        <div className=" bg-white w-full h-full absolute  flex justify-center items-center">
          <div className="w-full p-2">
            <CourseProgress
              variant={progress == 100 ? "success" : "default"}
              size="default"
              value={progress}
            ></CourseProgress>
          </div>
        </div>
      )}

      <FileUpload onChange={handleFileUpload} />
      <ConfirmModal
      disabled={!Boolean(questionsFromRoot.length)}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirm}
        content={
          <div className=" relative">
            <DataTable
              setQuestionsFromRoot={setQuestionsFromRoot}
              columns={ImportColumns}
              data={data}
            ></DataTable>
          </div>
        }
      >
        <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
      </ConfirmModal>
    </div>
  );
};

export default ImportFromExcel;
