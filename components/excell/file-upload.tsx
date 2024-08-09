"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

interface FileUploadProps {
  onChange: (file?: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onChange }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      onChange(file);
     // toast.success("File uploaded successfully!");
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
        'application/vnd.ms-excel': ['.xls'],
      },
  });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-md ${
        isDragActive ? "border-blue-500 bg-blue-50" : isDragReject ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50"
      }`}
    >
      <input {...getInputProps()} />
      <p className="text-lg font-medium text-gray-700 flex items-center justify-between flex-col">
        {isDragActive ? "Drop the files here..." : "Choose files or drag and drop"}
        <span className=" text-sm">(Import from excell) </span>
      </p>
    </div>
  );
};

export default FileUpload;
