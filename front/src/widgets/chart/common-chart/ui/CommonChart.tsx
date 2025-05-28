import type React from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TooltipProps } from "recharts/types/component/Tooltip";
import styles from "./CommonChart.module.css";
import clsx from "clsx";

interface CommonChartProps {
  data: { label: string; value: number }[];
  className?: string;
  chartColor?: string;
}

export const CommonChart: React.FC<CommonChartProps> = ({ data, className, chartColor = "#8884d8" }) => {
  return (
    <div className={clsx(styles.wrapper, className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart width={500} height={250} data={data}>
          <defs>
            <linearGradient id={`gradient-${chartColor}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
              <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="label" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip wrapperClassName={styles.label} content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={chartColor}
            fillOpacity={1}
            fill={`url(#gradient-${chartColor})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ payload, label, active }) => {
  if (active) {
    return (
      <div className={styles.customTooltip}>
        <p>{label}</p>
        {payload && <p>{payload[0].value}</p>}
      </div>
    );
  }

  return null;
};
