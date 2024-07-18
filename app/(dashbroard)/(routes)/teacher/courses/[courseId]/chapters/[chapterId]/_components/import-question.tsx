"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ImportQuestionProps {
  children: React.ReactNode;
  onConfirm: () => void;
}

const ImportQuestion = ({ children, onConfirm }: ImportQuestionProps) => {
  
  return (
    <AlertDialog  >
      <AlertDialogTrigger>
        <Button className="text-sm" variant="outline">
          Import from root question
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="  max-w-[90%]  max-h-[90%] overflow-auto border border-yellow-400   ">
        <AlertDialogHeader >
         
          <AlertDialogDescription asChild >

              {children}
           
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Save</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>

    </AlertDialog>
  );
};

export default ImportQuestion;
