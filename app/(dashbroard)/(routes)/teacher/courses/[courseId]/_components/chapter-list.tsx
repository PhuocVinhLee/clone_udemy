"use client";

import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Grid, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
interface ChapterListProps {
  items: any[];
  onReOrder: (updateData: { _id: string; position: number }[]) => void;
  onEdit: (_id: string) => void;
}

export const ChapterList = ({ items, onReOrder, onEdit }: ChapterListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState(items);
  console.log("item", chapters);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setChapters(items);
  }, [items]);

  if (!isMounted) {
    return null;
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(chapters);

    const [reorderedItem] = items.splice(result.source.index, 1);

    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

   
    const updatedChapters = items.slice(startIndex, endIndex + 1);
    setChapters(items);
    const bulkUpdateData = updatedChapters.map((chapter) => ({
      _id: chapter._id,
      position: items.findIndex((item) => item._id === chapter._id),
    }));

    onReOrder(bulkUpdateData);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {chapters.map((chapter, index) => (
              <Draggable key={chapter._id} draggableId={chapter._id} index={index}>
                {(provided) => (
                  <div
                    className={cn( 
                      "  flex items-center gap-x-2 bg-slate-200 border border-slate-200 text-slate-700 rounded-md mb-4 text-sm",
                      chapter.isPublished &&
                        "bg-sky-100 border-sky-200 text-sky-700"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-200 rounded-l-md transition",
                        chapter.isPublished &&
                          " border-r-sky-200 hover:bg-sky-200"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grid className="h-5 w-5"></Grid>
                    </div>

                    {chapter.title}
                   
                    <div className="  ml-auto pr-2 flex items-center gap-x-2">
                      {chapter.isFree && <Badge className=" bg-black dark:text-white dark:hover:text-black">Free</Badge>}

                      <Badge
                        className={cn(
                          "bg-slate-500",
                          chapter.isPublished && " bg-slate-700 dark:text-white dark:hover:text-black"
                        )}
                      >
                        {chapter.isPublished ? "Published" : "Draft"}
                      </Badge>

                      <Pencil onClick={()=> onEdit(chapter._id)} className="w-4 h-4 cursor-pointer transition hover:opacity-75">

                      </Pencil>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
