import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// Fonction pour formater les nombres avec des unités adaptées
const formatNumber = (num) => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
    return num.toString();
};

const DonutChart = ({ data }) => {
    const COLORS = ["#0088FE", "#FF8042"];

    const renderCustomLabel = ({ name, value }) => {
        return `${name}: ${formatNumber(value)}`;
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
                <Tooltip formatter={(value) => formatNumber(value)} />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default DonutChart;