// src/pages/university/analytics/DepartmentAnalytics.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DepartmentAnalytics = ({ data }) => {
    const formattedData = data?.map(dept => ({
        name: dept.department || dept.name,
        placedStudents: Number(dept.placedStudents),
        averagePackage: Number(dept.averagePackage)
    })).filter(dept => dept.name && (dept.placedStudents > 0 || dept.averagePackage > 0));

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Department-wise Performance</h2>
            <div style={{ width: '100%', height: 400, minHeight: '300px' }}>
                {formattedData && formattedData.length > 0 ? (
                    <ResponsiveContainer>
                        <BarChart
                            data={formattedData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="name" 
                                angle={-45}
                                textAnchor="end"
                                height={70}
                            />
                            <YAxis 
                                yAxisId="left" 
                                orientation="left" 
                                stroke="#8884d8"
                                label={{ value: 'Placed Students', angle: -90, position: 'insideLeft', offset: -5 }}
                            />
                            <YAxis 
                                yAxisId="right" 
                                orientation="right" 
                                stroke="#82ca9d"
                                label={{ value: 'Average Package (LPA)', angle: 90, position: 'insideRight', offset: 5 }}
                            />
                            <Tooltip />
                            <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                            <Bar 
                                yAxisId="left" 
                                dataKey="placedStudents" 
                                name="Placed Students" 
                                fill="#8884d8" 
                                radius={[5, 5, 0, 0]}
                            />
                            <Bar 
                                yAxisId="right" 
                                dataKey="averagePackage" 
                                name="Average Package (LPA)" 
                                fill="#82ca9d"
                                radius={[5, 5, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No department data available</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DepartmentAnalytics;