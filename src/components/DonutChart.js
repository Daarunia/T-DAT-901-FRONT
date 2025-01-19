import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const DonutChart = ({ data }) => {
    const COLORS = ["#0088FE", "#FF8042"];

    const renderCustomLabel = ({ name, percent }) => {
        return `${name}: ${(percent * 100).toFixed(1)}%`;
    };

    return (
        <ResponsiveContainer width="100%" height={426}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="label"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    fill="#8884d8"
                    label={renderCustomLabel}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString()} />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default DonutChart;
