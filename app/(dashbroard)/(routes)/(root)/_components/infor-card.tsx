import { IconBadge } from "@/components/icon-badge";
import { LucideIcon } from "lucide-react";


interface InForCardProps{
    numberOfItems: number;
    variant?: "default" |"succes";
    label: string;
    icon: LucideIcon;
}
const InforCard = ({variant, icon: Icon, numberOfItems, label}: InForCardProps) => {
  return (
    <div className=" border rounded-md flex items-center gap-x-2 p-3">
        <IconBadge variant={variant} icon={Icon}>

        </IconBadge>

        <div>
<p>{label}</p>
<p className=" text-gray-500 text-sm">{ numberOfItems} Courses</p>
        </div>
      
    </div>
  )
}

export default InforCard
