import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/format";

interface DataCardProps {
  value: number;
  label: string;
  shouldFormat?: boolean;
  Icon?: React.ComponentType<{
    size?: number | string;
    color?: string;
    className?: string;
  }>;
}

const DataCard = ({ value, label, shouldFormat , Icon}: DataCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-x-2 pb-2">
   
        <CardTitle className="text-sm font-medium flex flex-col gap-y-3"> {Icon && <Icon size={30} />} {label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className=" text-2xl font-bold">
          {shouldFormat ? formatPrice(value) : value}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataCard;
