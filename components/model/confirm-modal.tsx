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

interface ConfirmModalProps {
  children: React.ReactNode; // The element to trigger the modal
  content?: React.ReactNode;
  onConfirm: () => void;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

const ConfirmModal = ({
  children,
  content,
  onConfirm,
  isOpen,
  onOpen,
  onClose,
}: ConfirmModalProps) => {
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
        className={cn(content && "max-w-[98%] max-h-[98%] overflow-auto")}
      >
        <AlertDialogHeader>
          {!content ? (
            <>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </>
          ) : (
            content
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={closeModal}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirmHandler}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmModal;
