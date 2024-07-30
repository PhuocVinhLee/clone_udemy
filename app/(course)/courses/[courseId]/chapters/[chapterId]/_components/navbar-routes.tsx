"use client";

import {
  BarChart,
  Compass,
  FileQuestion,
  FileQuestionIcon,
  Layout,
  List,
} from "lucide-react";
import SidebarItem from "./navbar-item";
import { usePathname } from "next/navigation";

const Routes = [
  ///courses/6694977676296b1029a61112/chapters/6694978d76296b1029a6112d/overview
  {
    icon: FileQuestionIcon,
    label: "Review",
    href: "/review",
  },
  {
    icon: List,
    label: "Overview",
    href: "/overview",
  },
  {
    icon: List,
    label: "Exercise",
    href: "/exercise",
  },
  {
    icon: BarChart,
    label: "QandA",
    href: "/qanda",
  },
  {
    icon: FileQuestionIcon,
    label: "Resourse",
    href: "/resourse",
  },
];
interface NavBarRoutesProps {
  courseId: string;
  chapterId: string;
}
const NavBarRoutes = ({ chapterId, courseId }: NavBarRoutesProps) => {
  const pathname = usePathname();
  const rootHref = `/courses/${courseId}/chapters/${chapterId}`;
  return (
    <div className="flex  items-center justify-between w-full">
      {Routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={rootHref + route.href}
        ></SidebarItem>
      ))}
    </div>
  );
};

export default NavBarRoutes;
