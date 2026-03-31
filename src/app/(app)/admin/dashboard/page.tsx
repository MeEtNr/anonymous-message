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
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-12">
      {/* ── HEADER ── */}
      <div className="flex flex-col gap-3 opacity-0 animate-[slideUp_0.8s_0.1s_ease_both]">
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
          Admin <span className="shimmer-text">Insights</span>
        </h1>
        <p className="text-slate-400 font-light flex items-center gap-2 text-lg">
          Monitor platform growth and user engagement with real-time feedback metrics.
        </p>
      </div>

      {/* ── STATS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "#8b5cf6" },
          { title: "Verified Users", value: stats?.verifiedUsers || 0, icon: UserCheck, color: "#10b981" },
          { 
            title: "New Signups (30d)", 
            value: stats?.signupTrends.reduce((acc, curr) => acc + curr.count, 0) || 0, 
            icon: TrendingUp, 
            color: "#0ea5e9" 
          },
        ].map((item, idx) => (
          <div key={idx} className="glass-card p-8 rounded-[2rem] relative overflow-hidden group opacity-0 animate-[slideUp_0.8s_0.2s_ease_both]">
             {/* Subtle Glow */}
            <div className="absolute -top-12 -right-12 w-24 h-24 blur-[60px] rounded-full transition-opacity opacity-20 group-hover:opacity-40" style={{ backgroundColor: item.color }} />
            
            <div className="flex flex-row items-center justify-between mb-8">
              <span className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">{item.title}</span>
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border transition-all duration-300" 
                style={{ 
                  backgroundColor: `${item.color}15`, 
                  borderColor: `${item.color}30`,
                  color: item.color,
                  boxShadow: `0 8px 16px -4px ${item.color}30`
                }}
              >
                <item.icon className="h-6 w-6" />
              </div>
            </div>
            
            <div className="flex items-end gap-3">
              <span className="text-5xl font-black text-white tracking-tighter">{item.value}</span>
              <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Members</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── GRAPH AREA ── */}
      <div className="glass-card p-4 rounded-[2.5rem] opacity-0 animate-[slideUp_0.8s_0.3s_ease_both]">
        <div className="px-8 pt-8 pb-4">
          <h2 className="text-2xl font-black text-white tracking-tight">Growth Analytics</h2>
          <p className="text-slate-500 text-sm font-light mt-1">Platform-wide registration trends for the last 30 days</p>
        </div>
        <div className="h-[400px] w-full mt-6 px-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats?.signupTrends} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="_id" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                tickFormatter={(str) => {
                  const date = new Date(str);
                  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                }}
                dy={15}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                dx={-10}
              />
              <Tooltip 
                cursor={{ stroke: 'rgba(139, 92, 246, 0.2)', strokeWidth: 2 }}
                contentStyle={{ 
                  borderRadius: '20px', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                  padding: '16px',
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  backdropFilter: 'blur(16px)'
                }}
                itemStyle={{ color: '#fff', fontWeight: '800', fontSize: '18px' }}
                labelStyle={{ color: '#94a3b8', marginBottom: '6px', fontSize: '12px', fontWeight: '600' }}
                labelFormatter={(label) => new Date(label).toLocaleDateString(undefined, { dateStyle: 'long' })}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#8b5cf6" 
                strokeWidth={5}
                dot={{ r: 5, fill: '#8b5cf6', strokeWidth: 3, stroke: '#1e1b4b' }}
                activeDot={{ r: 8, strokeWidth: 0, fill: '#fff' }}
                animationDuration={2500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── USER TABLE ── */}
      <div className="glass-card rounded-[2.5rem] overflow-hidden opacity-0 animate-[fadeInScale_1s_0.4s_ease_both]">
        <div className="px-10 pt-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">User Directory</h2>
            <p className="text-slate-500 font-light mt-1">Manage and audit all platform participants.</p>
          </div>
          <div className="badge-pill px-5 py-2.5 rounded-2xl flex items-center gap-3 shadow-xl">
            <span className="text-xs font-black text-violet-400 uppercase tracking-widest">{users.length} TOTAL</span>
          </div>
        </div>

        <div className="px-6 pb-10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-separate border-spacing-y-3">
              <thead>
                <tr className="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em]">
                  <th className="px-8 pb-4">User Profile</th>
                  <th className="px-6 pb-4">Email</th>
                  <th className="px-6 pb-4">Status</th>
                  <th className="px-6 pb-4">Role</th>
                  <th className="px-6 pb-4">Joined</th>
                </tr>
              </thead>
              <tbody className="space-y-4">
                {users.map((user) => (
                  <tr key={user._id} className="group transition-all duration-300">
                    <td className="px-8 py-5 bg-white/5 first:rounded-l-3xl border-y border-l border-white/5 group-hover:bg-white/10 group-hover:border-violet-500/20 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-xl shadow-slate-950/40">
                          {user.username[0].toUpperCase()}
                        </div>
                        <span className="font-black text-slate-100 text-base">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 bg-white/5 border-y border-white/5 group-hover:bg-white/10 group-hover:border-violet-500/20 transition-colors">
                      <span className="text-slate-400 font-medium">{user.email}</span>
                    </td>
                    <td className="px-6 py-5 bg-white/5 border-y border-white/5 group-hover:bg-white/10 group-hover:border-violet-500/20 transition-colors">
                      {user.isVerified ? (
                        <div className="flex items-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded-xl w-fit border border-emerald-500/20">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Verified
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-xl w-fit border border-white/10">
                          Pending
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5 bg-white/5 border-y border-white/5 group-hover:bg-white/10 group-hover:border-violet-500/20 transition-colors">
                      <span className={cn(
                        "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                        user.role === 'admin' 
                          ? "bg-violet-500/20 text-violet-300 border-violet-500/30" 
                          : "bg-white/5 text-slate-400 border-white/10"
                      )}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-5 bg-white/5 last:rounded-r-3xl border-y border-r border-white/5 group-hover:bg-white/10 group-hover:border-violet-500/20 transition-colors text-slate-500 font-bold">
                      {new Date(user.createdAt).toLocaleDateString(undefined, { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
