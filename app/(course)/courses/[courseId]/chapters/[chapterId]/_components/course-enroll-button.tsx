"use client";

import ConfirmModal from "@/components/model/confirm-modal";
import ConfirmModalPayMent from "@/components/model/confirm-modal-payment";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
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

  const handleVNPayPayment = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/courses/${courseId}/vnpay`, {
        amount: 10000,
        orderDescription: "Payment for course XYZ",
        orderType: "billpayment",
        bankCode: "VNPAYQR",
      });
      window.location.assign(response.data.url);
    } catch (error) {
      toast.error("Payment initiation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const content = (
    <div className="flex flex-col p-5  items-center justify-between gap-y-4">
      <div>Choose 1 payment method</div>
      <div className=" flex gap-x-2">
        {/* <Button
          onClick={() => {
            handleVNPayPayment();
          }}
        >
          VN Pay
        </Button> */}
        <Button onClick={onclick}>Stripe</Button>
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
      <ConfirmModalPayMent onConfirm={() => {}} content={content}>
        <Button size="sm" className="w-full md:w-auto">
          Enroll for {formatPrice(price)}
        </Button>
      </ConfirmModalPayMent>
    </div>
  );
};

export default CourseEnrollButton;
