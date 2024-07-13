"use client";

import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import {
  useParams,
  usePathname,
  useSearchParams,
  useRouter,
} from "next/navigation";

import qs from "query-string";


const SearchInput = () => {
  const [value, setValue] = useState("");
  const debounceValue = useDebounce(value);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentCaterogyId = searchParams.get("categoryId");

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: debounceValue,
          categoryId: currentCaterogyId,
        },
      },
      {
        skipNull: true,
        skipEmptyString: true,
      }
    );

    router.push(url);
  }, [debounceValue, currentCaterogyId, router, pathname]);
  
  return (
  
    <div className=" relative">
      <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600"></Search>

      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className=" w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
        placeholder={pathname?.includes("search") ? "Search for courses..." :
           pathname?.includes("questions")? "Search for questions...": " Search..." }
      ></Input>
    </div>
  );
};

export default SearchInput;
