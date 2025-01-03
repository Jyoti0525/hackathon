// src/pages/university/Placements.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UniversityService from '../../services/universityService';

const Placements = () => {
    const [placements, setPlacements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        department: '',
        company: '',
        packageRange: '',
        searchQuery: ''
    });
    const [stats, setStats] = useState({
        totalPlacements: 0,
        averagePackage: 0,
        highestPackage: 0,
        companiesHiring: 0
    });

    const navigate = useNavigate();

    const fetchPlacements = async () => {
        try {
            setLoading(true);
            const response = await UniversityService.getAvailableData();
            if (response.success) {
                const formattedPlacements = response.data.placements.map(placement => ({
                    id: placement._id,
                    studentName: placement.student?.name || 'Unknown Student',
                    company: placement.company?.name || 'Unknown Company',
                    role: placement.role || 'Not specified',
                    package: placement.package || 0,
                    department: placement.student?.department || 'Not specified',
                    date: new Date(placement.date).toLocaleDateString(),
                    status: placement.status || 'Completed'
                }));

                setPlacements(formattedPlacements);
                calculateStats(formattedPlacements);
            }
        } catch (error) {
            console.error('Error fetching placements:', error);
            setError('Failed to load placement data');
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (placementData) => {
        const total = placementData.length;
        const packages = placementData.map(p => p.package);
        const avgPackage = total > 0 ? packages.reduce((a, b) => a + b, 0) / total : 0;
        const maxPackage = Math.max(...packages, 0);
        const companies = new Set(placementData.map(p => p.company)).size;

        setStats({
            totalPlacements: total,
            averagePackage: avgPackage.toFixed(2),
            highestPackage: maxPackage,
            companiesHiring: companies
        });
    };

    useEffect(() => {
        fetchPlacements();
    }, []);

    const filteredPlacements = placements.filter(placement => {
        const searchLower = filters.searchQuery.toLowerCase();
        const matchesSearch = placement.studentName.toLowerCase().includes(searchLower) ||
                            placement.company.toLowerCase().includes(searchLower) ||
                            placement.role.toLowerCase().includes(searchLower);
        
        const matchesDepartment = !filters.department || placement.department === filters.department;
        const matchesCompany = !filters.company || placement.company === filters.company;

        let matchesPackage = true;
        if (filters.packageRange) {
            const [min, max] = filters.packageRange.split('-').map(Number);
            matchesPackage = placement.package >= min && placement.package <= max;
        }

        return matchesSearch && matchesDepartment && matchesCompany && matchesPackage;
    });

    const departments = [...new Set(placements.map(p => p.department))];
    const companies = [...new Set(placements.map(p => p.company))];

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const exportToCSV = () => {
        const headers = ['Student Name', 'Company', 'Role', 'Package (LPA)', 'Department', 'Date'];
        const csvData = filteredPlacements.map(p => [
            p.studentName,
            p.company,
            p.role,
            p.package,
            p.department,
            p.date
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = `placements_${new Date().toISOString().slice(0,10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-red-600 bg-red-100 rounded-lg m-6">
                {error}
                <button 
                    onClick={fetchPlacements}
                    className="ml-4 text-sm underline hover:text-red-800"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 min-h-screen bg-gray-50">
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-bold">Placement Management</h1>
                        <p className="text-gray-600">Track and analyze student placements</p>
                    </div>
                    <div className="space-x-4">
                        <button
                            onClick={exportToCSV}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                            Export Data
                        </button>
                        <button
                            onClick={fetchPlacements}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Refresh List
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm">Total Placements</h3>
                        <p className="text-2xl font-bold">{stats.totalPlacements}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm">Average Package</h3>
                        <p className="text-2xl font-bold text-green-600">{stats.averagePackage} LPA</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm">Highest Package</h3>
                        <p className="text-2xl font-bold text-blue-600">{stats.highestPackage} LPA</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-gray-500 text-sm">Companies Hiring</h3>
                        <p className="text-2xl font-bold text-purple-600">{stats.companiesHiring}</p>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <input
                            type="text"
                            placeholder="Search placements..."
                            className="border rounded-lg px-4 py-2"
                            name="searchQuery"
                            value={filters.searchQuery}
                            onChange={handleFilterChange}
                        />
                        <select
                            name="department"
                            value={filters.department}
                            onChange={handleFilterChange}
                            className="border rounded-lg px-4 py-2"
                        >
                            <option value="">All Departments</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                        <select
                            name="company"
                            value={filters.company}
                            onChange={handleFilterChange}
                            className="border rounded-lg px-4 py-2"
                        >
                            <option value="">All Companies</option>
                            {companies.map(company => (
                                <option key={company} value={company}>{company}</option>
                            ))}
                        </select>
                        <select
                            name="packageRange"
                            value={filters.packageRange}
                            onChange={handleFilterChange}
                            className="border rounded-lg px-4 py-2"
                        >
                            <option value="">All Packages</option>
                            <option value="0-5">0-5 LPA</option>
                            <option value="5-10">5-10 LPA</option>
                            <option value="10-15">10-15 LPA</option>
                            <option value="15-100">15+ LPA</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Placements Table */}
                <div className="lg:col-span-3 bg-white rounded-lg shadow">
                    <div className="h-[calc(100vh-380px)] overflow-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Student Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Company
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Package
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Department
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredPlacements.map((placement, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {placement.studentName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{placement.company}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{placement.role}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-green-600">
                                                {placement.package} LPA
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{placement.department}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {placement.date}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="text-lg font-semibold mb-4">Recent Placements</h3>
                        <div className="space-y-3">
                            {placements.slice(0, 5).map((placement, index) => (
                                <div key={index} className="border-b pb-2 last:border-0">
                                    <p className="text-sm font-medium">{placement.studentName}</p>
                                    <p className="text-xs text-gray-500">
                                        {placement.company} - {placement.role}
                                    </p>
                                    <p className="text-xs text-green-600">{placement.package} LPA</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="text-lg font-semibold mb-4">Department Overview</h3>
                        <div className="space-y-2">
                            {departments.map(dept => {
                                const count = placements.filter(p => p.department === dept).length;
                                return (
                                    <div key={dept} className="flex justify-between items-center">
                                        <span className="text-sm">{dept}</span>
                                        <span className="text-sm font-medium">{count} placed</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Placements;