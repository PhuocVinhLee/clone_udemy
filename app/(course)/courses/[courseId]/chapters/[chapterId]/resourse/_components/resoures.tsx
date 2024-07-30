"use client"
import { File } from "lucide-react";

interface ResouresProps {
    attachments: any[] | null;
}
const Resoures = ({ attachments }: ResouresProps) => {
  return <div>
      {!!attachments?.length && (
          <>
            {/* <Separator></Separator> */}
            <div className=" flex gap-y-4 flex-col">
              {attachments.map((attachment) => (
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
              ))}
            </div>
          </>
        )}
  </div>;
};

export default Resoures;
