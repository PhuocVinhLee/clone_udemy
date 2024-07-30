import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface PopoverCpnProps {
  children: React.ReactNode;
  content: React.ReactNode;
}

export function PopoverCpn({ children, content }: PopoverCpnProps) {
  return (
    <Popover >
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="  max-h-[400px] min-w-5  min-h-5 overflow-auto  z-[100]  bg-slate-700 p-0 m-4 mr-4  w-auto">
        <div className=" ">
        {content}
        </div>
      </PopoverContent>
    </Popover>
  );
}
