"use client";

import ConfirmModal from "@/components/model/confirm-modal";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseEnrollButtonProps {
  courseId: string;
  price: number;
}
const CourseEnrollButton = ({ courseId, price }: CourseEnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onclick = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/courses/${courseId}/checkout`);
      window.location.assign(response.data.url);
    } catch (error) {
      toast.error("Some thing went wrong in trasition");
    } finally {
      setIsLoading(false);
    }
  };

  const content = (
    <div className="flex flex-col border  border-red-500">
      <div>Choose 1 payment method</div>
      <div className=" flex gap-x-2">
        <Button>VN Pay</Button>
        <Button>Stripe</Button>
        {/* <Button
          onClick={onclick}
          disabled={isLoading}
          size="sm"
          className="w-full md:w-auto"
        >
          Enroll for {formatPrice(price)}
        </Button> */}
      </div>
    </div>
  );
  return (
    <div>
      <ConfirmModal onConfirm={() => {}} content={content}>
        <Button size="sm" className="w-full md:w-auto">
          Enroll for2 {formatPrice(price)}
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default CourseEnrollButton;
