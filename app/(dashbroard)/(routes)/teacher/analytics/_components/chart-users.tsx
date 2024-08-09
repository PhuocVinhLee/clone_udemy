"use client";

import { Card } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartUserProps {
  data: { name: string; users: number }[];
  year: string;
}

const ChartUser = ({ data, year }: ChartUserProps) => {
  return (
    <Card className="w-full h-full p-4">
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="users" stroke="#888888" fill="#0369a1" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center">{`Users Chart for ${year}`}</div>
    </Card>
  );
};

export default ChartUser;
