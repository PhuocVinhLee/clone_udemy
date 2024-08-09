import mongoose from "mongoose";
import Courses, { CourseType } from "../database/models/courses.model";

import Purchase, { PurchaseType } from "../database/models/purchase.model";
import { connectToDatabase } from "../database/mongoose";
import { getUserById } from "./user.actions";

interface FormattedUserData {
  name: string;
  users: number;
}
type PurchaseWithCourse = PurchaseType & {
  course: CourseType;
};
const groupByCourse = (purchase: PurchaseWithCourse[]) => {
  const grouped: { [courseTitle: string]: number } = {};

  purchase.forEach((purchase) => {
    const courseTitle = purchase.course.title;
    if (!grouped[courseTitle]) {
      grouped[courseTitle] = 0;
    }

    grouped[courseTitle] += purchase.course.price!;
  });

  return grouped;
};

import { format, parseISO } from "date-fns";

interface UserData {
  createdAt: string | Date; // Allow both string and Date
}

interface FormattedUserData {
  name: string;
  users: number;
}

const userData: UserData[] = [
  // Your data here
];

const getMonthlyUserCounts = (data: UserData[]): FormattedUserData[] => {
  const monthMap = new Map<string, number>();

  data.forEach((user) => {
    // Ensure createdAt is a string
    let date: Date;
    if (typeof user.createdAt === "string") {
      date = parseISO(user.createdAt);
    } else if (user.createdAt instanceof Date) {
      date = user.createdAt;
    } else {
      // Handle unexpected types
      console.error("Unexpected date format:", user.createdAt);
      return;
    }

    const monthYear = format(date, "MMMM yyyy"); // Format to "Month yyyy"
    monthMap.set(monthYear, (monthMap.get(monthYear) || 0) + 1);
  });

  // Generate list of months from January to December
  const months: string[] = [];
  for (let month = 0; month < 12; month++) {
    const monthName = format(new Date(2024, month, 1), "MMMM yyyy");
    months.push(monthName);
  }

  // Fill missing months with 0 users
  const formattedData: FormattedUserData[] = months.map((month) => ({
    name: month,
    users: monthMap.get(month) || 0,
  }));

  return formattedData;
};

const formattedUserData = getMonthlyUserCounts(userData);
console.log(formattedUserData);

export const getAnalytics = async (
  userId: string
): Promise<{
  data: any[];
  formattedUserData: FormattedUserData[];
  totalRevenue: number;
  totalSales: number;
  totalCourses: number;
  totalUsers: number;
}> => {
  try {
    await connectToDatabase();

    const user = await getUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const purchases = await Purchase.aggregate([
      { $match: {} },
      {
        $lookup: {
          from: "courses", // Name of the courses collection
          localField: "courseId",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
    ]);

    const findTeacherPurchase = purchases.filter((purchase) => {
      return purchase.course.userId.toHexString() === user._id;
    });

    const groupedEarning = groupByCourse(findTeacherPurchase);
    const data = Object.entries(groupedEarning).map(([courseTitle, total]) => ({
      name: courseTitle,
      total: total,
    }));

    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);

    const totalSales = findTeacherPurchase.length;

    const totalCourses = await Courses.find({ userId: user._id });
    console.log(findTeacherPurchase);
    const uniqueUsers = Array.from(
      new Map(
        findTeacherPurchase.map((item) => [item.userId.toString(), item])
      ).values()
    );

    const formattedUserData = getMonthlyUserCounts(findTeacherPurchase);

    return {
      formattedUserData,
      totalCourses: totalCourses.length,
      totalUsers: uniqueUsers.length,
      data,
      totalRevenue,
      totalSales,
    };
  } catch (error) {
    console.log("An error in action Get Analytics", error);
    return {
      formattedUserData: [],
      totalCourses: 0,
      totalUsers: 0,
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }
};
