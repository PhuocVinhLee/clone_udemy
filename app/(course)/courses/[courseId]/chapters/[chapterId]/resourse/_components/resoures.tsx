"use client";
import { File } from "lucide-react";

interface ResouresProps {
  attachments: any[] | null;
}
const Resoures = ({ attachments }: ResouresProps) => {
  return  <div className=" flex gap-y-4 flex-col">
    {attachments?.length
      ? attachments?.map((attachment) => (
          <a
            href={attachment.url}
            target="_blank"
            key={attachment._id}
            className="flex items-center p-3 w-full
                 bg-sky-200 text-sky-700 border rounded-md hover:underline"
          >
            <File></File>
            <p className=" line-clamp-1">{attachment.name}</p>
          </a>
        ))
      : "Attachments not found!"}
  </div>;
};

export default Resoures;
