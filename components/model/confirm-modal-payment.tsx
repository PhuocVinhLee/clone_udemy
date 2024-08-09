"use client";
import React, { useState, useEffect } from "react";
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
import { cn } from "@/lib/utils";

interface ConfirmModalPayMentProps {
  children: React.ReactNode; // The element to trigger the modal
  content?: React.ReactNode;
  onConfirm: () => void;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

const ConfirmModalPayMent = ({
  children,
  content,
  onConfirm,
  isOpen,
  onOpen,
  onClose,
}: ConfirmModalPayMentProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Sync internal state with prop `isOpen`
  useEffect(() => {
    if (isOpen !== undefined) {
      setInternalIsOpen(isOpen);
    }
  }, [isOpen]);

  const openModal = () => {
    if (onOpen) {
      onOpen();
    } else {
      setInternalIsOpen(true);
    }
  };

  const closeModal = () => {
    if (onClose) {
      onClose();
    } else {
      setInternalIsOpen(false);
    }
  }

  const confirmHandler =  () => {
    onConfirm();
    closeModal();
  };

  return (
    <AlertDialog open={internalIsOpen} onOpenChange={setInternalIsOpen}>
      {isOpen === undefined ? (
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      ) : null}

      <AlertDialogContent
        className={cn(content && "max-w-[50%] max-h-[98%] overflow-auto")}
      >
        <AlertDialogHeader>
         {content}
        </AlertDialogHeader>
        <AlertDialogFooter className=" absolute top-0 right-0">
          <AlertDialogCancel onClick={closeModal}>X</AlertDialogCancel>

        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmModalPayMent;
