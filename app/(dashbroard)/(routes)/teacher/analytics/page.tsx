import { getAnalytics } from "@/lib/actions/get-analytics";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import DataCard from "./_components/data-card";
import Chart from "./_components/chart";

const AnalyticsPage = async () => {
  const { userId } = auth();
  if (!userId) redirect("/");
  const { data, totalRevenue, totalSales } = await getAnalytics(userId);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard
          label="Total Revenue"
          value={totalRevenue}
          shouldFormat
        ></DataCard>
        <DataCard label="Total Sales" value={totalSales}></DataCard>
      </div>
      <Chart data={data} >
 
      </Chart>
    </div>
  );
};

export default AnalyticsPage;
