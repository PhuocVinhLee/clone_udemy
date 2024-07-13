
"use client"
import {
  FcEngineering,
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode,
} from "react-icons/fc";
import { IconType } from "react-icons/lib";
import CategoryItem from "./CategoryItem";

interface CategoryProps {
  items: { name: string; _id: string }[];
}

const iconMap: Record<{ name: string; _id: string } ["name"], IconType> ={
   "Engineering": FcEngineering,
   "Filming": FcFilmReel,
    "Computer Science":FcMultipleDevices,
    "Music":FcMusic,
    "Photography":FcOldTimeCamera,
   "Accounting": FcSalesPerformance,
   "Finess": FcSportsMode,
    

}
const Categories = ({ items }: CategoryProps) => {
  return <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
    {items?.map((item)=>(
        <CategoryItem key={item._id} label={item.name} icon={iconMap[item.name]} value={item._id}>
        </CategoryItem>
    ))}
  </div>;
};

export default Categories;
