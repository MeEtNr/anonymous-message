"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, UserCheck, TrendingUp, Loader2, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stats {
  totalUsers: number;
  verifiedUsers: number;
  signupTrends: { _id: string; count: number }[];
}

interface User {
  _id: string;
  username: string;
  email: string;
  isVerified: boolean;
  role: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          axios.get("/api/admin/stats"),
          axios.get("/api/admin/users"),
        ]);
        setStats(statsRes.data.stats);
        setUsers(usersRes.data.users);
      } catch (err: any) {
        console.error("Error fetching admin data", err);
        setError(err.response?.data?.message || "Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-slate-500 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex flex-col items-center text-center max-w-md">
          <ShieldAlert className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-red-900 mb-2">Access Denied</h2>
          <p className="text-red-700 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Admin Insights</h1>
        <p className="text-slate-500 flex items-center gap-2">
          Monitor platform growth and user engagement.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "blue" },
          { title: "Verified Users", value: stats?.verifiedUsers || 0, icon: UserCheck, color: "green" },
          { 
            title: "New Signups (30d)", 
            value: stats?.signupTrends.reduce((acc, curr) => acc + curr.count, 0) || 0, 
            icon: TrendingUp, 
            color: "purple" 
          },
        ].map((item, idx) => (
          <Card key={idx} className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-slate-400 uppercase tracking-wider">{item.title}</CardTitle>
              <div className={cn(
                "p-2 rounded-xl transition-colors",
                item.color === 'blue' ? "bg-blue-50 text-blue-600" :
                item.color === 'green' ? "bg-green-50 text-green-600" :
                "bg-purple-50 text-purple-600"
              )}>
                <item.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-slate-900">{item.value}</div>
            </CardContent>
            <div className={cn(
              "h-1.5 w-full",
              item.color === 'blue' ? "bg-blue-500" :
              item.color === 'green' ? "bg-green-500" :
              "bg-purple-500"
            )} />
          </Card>
        ))}
      </div>

      {/* Graph Area */}
      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden p-2">
        <CardHeader className="px-6 pt-6">
          <CardTitle className="text-xl font-bold text-slate-900">User Growth Trends</CardTitle>
          <CardDescription>Visualizing daily registrations for the past month</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats?.signupTrends} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="_id" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 13, fill: '#94a3b8', fontWeight: 500 }}
                tickFormatter={(str) => {
                  const date = new Date(str);
                  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 13, fill: '#94a3b8', fontWeight: 500 }}
                dx={-10}
              />
              <Tooltip 
                cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                  padding: '12px 16px',
                  backgroundColor: '#ffffff'
                }}
                itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                labelFormatter={(label) => new Date(label).toLocaleDateString(undefined, { dateStyle: 'long' })}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#2563eb" 
                strokeWidth={4}
                dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8, strokeWidth: 0, fill: '#2563eb' }}
                animationDuration={2000}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* User Table */}
      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
        <CardHeader className="px-8 pt-8">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-slate-900 text-pretty">User Directory</CardTitle>
              <CardDescription>Detailed overview of all platform members</CardDescription>
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
              {users.length} Total Members
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8 mt-6">
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">User Profile</th>
                  <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Email Address</th>
                  <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Status</th>
                  <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Role</th>
                  <th className="px-6 py-4 font-bold text-slate-600 uppercase tracking-wider text-[11px]">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user) => (
                  <tr key={user._id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
                          {user.username[0].toUpperCase()}
                        </div>
                        <span className="font-bold text-slate-900">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-slate-600 font-medium">{user.email}</span>
                    </td>
                    <td className="px-6 py-5">
                      {user.isVerified ? (
                        <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2.5 py-1 rounded-full w-fit">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-[11px] font-bold uppercase">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full w-fit border border-slate-100">
                          <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                          <span className="text-[11px] font-bold uppercase">Pending</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <span className={cn(
                        "px-2.5 py-1 rounded-lg text-[11px] font-black uppercase border",
                        user.role === 'admin' 
                          ? "bg-indigo-50 text-indigo-700 border-indigo-100" 
                          : "bg-slate-50 text-slate-500 border-slate-100"
                      )}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-slate-500 font-medium">
                      {new Date(user.createdAt).toLocaleDateString(undefined, { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
