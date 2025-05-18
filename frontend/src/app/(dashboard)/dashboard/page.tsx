"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const statTitles = [
  { key: "totalUsers", label: "Total Users" },
  { key: "totalVehicles", label: "Total Vehicles" },
  { key: "totalReservations", label: "Total Reservations" },
  { key: "totalRevenue", label: "Total Revenue" },
  { key: "occupancyRate", label: "Occupancy Rate" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [adminStats, setAdminStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === "admin") {
      setLoading(true);
      fetch("http://localhost:5000/api/analytics/dashboard")
        .then((res) => res.json())
        .then((data) => {
          setAdminStats(data);
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to load dashboard stats");
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // Admin dashboard
  if (user?.role === "admin" && adminStats) {
    // Prepare chart data
    const chartData = [
      { name: "Users", value: adminStats.totalUsers },
      { name: "Vehicles", value: adminStats.totalVehicles },
      { name: "Reservations", value: adminStats.totalReservations },
      { name: "Revenue", value: adminStats.totalRevenue },
    ];
    return (
      <div className="space-y-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {statTitles.map((stat) => (
            <Card key={stat.key} className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm text-gray-500">
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">
                  {stat.key === "totalRevenue"
                    ? `$${adminStats[stat.key].toLocaleString()}`
                    : adminStats[stat.key]}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // Regular user dashboard
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">
        Welcome, {user?.firstName || user?.username}!
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>My Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">--</div>
            <div className="text-gray-500 text-sm">Coming soon</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>My Reservations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">--</div>
            <div className="text-gray-500 text-sm">Coming soon</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
