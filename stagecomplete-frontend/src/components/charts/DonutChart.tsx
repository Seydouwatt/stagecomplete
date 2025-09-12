import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface DataPoint {
  name: string;
  value: number;
  color?: string;
}

interface DonutChartProps {
  data: DataPoint[];
  height?: number;
  colors?: string[];
  showLegend?: boolean;
}

const DEFAULT_COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"];

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  height = 300,
  colors = DEFAULT_COLORS,
  showLegend = true,
}) => {
  const dataWithColors = data.map((item, index) => ({
    ...item,
    color: item.color || colors[index % colors.length],
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={dataWithColors}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
        >
          {dataWithColors.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--b1))",
            border: "1px solid hsl(var(--b3))",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        />
        {showLegend && (
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        )}
      </PieChart>
    </ResponsiveContainer>
  );
};
