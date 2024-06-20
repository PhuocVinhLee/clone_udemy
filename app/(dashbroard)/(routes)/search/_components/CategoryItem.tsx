"use client"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { Icon } from "lucide-react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import qs from "query-string";
import React from "react";
import { IconType } from "react-icons/lib";
interface CategoryItemProps {
  label: string;
  value?: string;
  icon?: IconType;
}

const CategoryItem = ({ label, value, icon: Icon }: CategoryItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const cuurrentCategoryId = searchParams.get("categoryId");
  const cuurrentTitle = searchParams.get("title");
  const isSelected = cuurrentCategoryId === value;
  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: cuurrentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      {
        skipNull: true,
        skipEmptyString: true,
      }
    );
    router.push(url);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        " py-2 px-3 text-sm border   border-slate-200 rounded-full flex items-center gap-x-1 hover:border-sky-700 transition",
        isSelected && "border-sky-700  bg-sky-200/20 text-sky-800"
      )}
    >
      {Icon && <Icon size={20}></Icon>}
      <div className=" truncate">{label}</div>
    </button>
  );
};

export default CategoryItem;
