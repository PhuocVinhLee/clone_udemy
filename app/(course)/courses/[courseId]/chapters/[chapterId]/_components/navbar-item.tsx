import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
//import { useRouter } from "next/router";

interface NavBarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

const NavbarItem = ({ icon: Icon, label, href }: NavBarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const isActive =
  
    pathname?.includes(`${href}`);

  const onclick = () => {
    if( !pathname?.includes(href)){
      router.push(href);
    }
    
  };
  return (
    <button
      onClick={onclick}
      type="button"
      className={cn(
        "flex items-center  dark:text-white  text-slate-500 text-sm font-[500]   hover:text-slate-600 hover:bg-slate-300/20",
        isActive &&
          "text-sky-700 bg-sky-200/20 hover:text-sky-700 hover:bg-sky-200/20 "
      )}
    >
      <div className="flex items-center gap-x-2  p-2">
        <Icon
          size={22}
          className={cn(
            "text-slate-500 dark:text-white",
            isActive && "text-sky-700 "
          )}
        />
        {label}
      </div>
     
    </button>
  );
};

export default NavbarItem;
