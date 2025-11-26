import React from 'react';
import { 
    ResponsiveContainer, 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    Legend 
} from 'recharts';

const PatientHistoryChart = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={data}
                margin={{
                    top: 5, right: 30, left: 0, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis 
                    dataKey="date" 
                    stroke="#6b7280"
                    fontSize={12}
                />
                <YAxis 
                    yAxisId="left" 
                    label={{ value: 'Cấp độ Bệnh (0-4)', angle: -90, position: 'insideLeft', fill: '#d97706' }} 
                    stroke="#d97706" 
                    domain={[0, 4]} // Miền giá trị từ 0 đến 4
                    allowDecimals={false}
                />
                <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    label={{ value: 'HbA1c (%)', angle: 90, position: 'insideRight', fill: '#059669' }} 
                    stroke="#059669"
                    domain={[4, 15]} // Miền giá trị HbA1c
                />
                <Tooltip 
                    contentStyle={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Line 
                    yAxisId="left" 
                    type="monotone" 
                    dataKey="level" 
                    name="Cấp độ Bệnh (AI)" 
                    stroke="#d97706" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                />
                <Line 
                    yAxisId="right" 
                    type="monotone" 
                    dataKey="hba1c" 
                    name="Chỉ số HbA1c" 
                    stroke="#059669" 
                    strokeWidth={2}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default PatientHistoryChart;