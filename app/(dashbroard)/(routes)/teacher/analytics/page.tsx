import { getAnalytics } from "@/lib/actions/get-analytics";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import DataCard from "./_components/data-card";
import Chart from "./_components/chart";
import ChartUser from "./_components/chart-users";
import {  List, Users  } from "lucide-react";

const AnalyticsPage = async () => {
  const { userId } = auth();
  if (!userId) redirect("/");
  const { data, totalRevenue, totalSales , totalCourses,totalUsers ,formattedUserData } = await getAnalytics(userId);


  
  console.log( "formattedUserData", formattedUserData)
  return (
    <div className="p-6  flex flex-col gap-y-6">
      <div className=" flex gap-x-6 ">
      <ChartUser data={formattedUserData } year="2024" />
        <div className=" flex flex-col gap-y-6  min-w-60 h-[300px]">
          <DataCard Icon={List }
            label="Total Courses"
            value={totalCourses}
          
          ></DataCard>
          <DataCard  Icon={Users }
            label="Total Users"
            value={totalUsers}
           
          ></DataCard>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
        <DataCard
          label="Total Revenue"
          value={totalRevenue}
          shouldFormat
        ></DataCard>
        <DataCard label="Total Sales" value={totalSales}></DataCard>
      </div>
      <Chart data={data}></Chart>
    </div>
  );
};

export default AnalyticsPage;
