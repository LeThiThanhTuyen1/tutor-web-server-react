"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import StatCard from "./stat-card"
import type { RootState } from "../../store/store"

// Mock data for the dashboard
const mockStats = {
  courses: 12,
  students: 87,
  tutors: 24,
  reviews: 156,
}

const mockBarData = [
  { name: "Jan", students: 20 },
  { name: "Feb", students: 35 },
  { name: "Mar", students: 42 },
  { name: "Apr", students: 38 },
  { name: "May", students: 55 },
  { name: "Jun", students: 70 },
]

const mockPieData = [
  { name: "Mathematics", value: 35 },
  { name: "Science", value: 25 },
  { name: "Languages", value: 20 },
  { name: "Arts", value: 10 },
  { name: "Other", value: 10 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function Dashboard() {
  const { user } = useSelector((state: RootState) => state.auth)
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {greeting}, {user?.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here's what's happening with your {user?.role === "Tutor" ? "teaching" : "learning"} today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Courses" value={mockStats.courses} icon="📚" trend="+2" trendDirection="up" />
        <StatCard title="Students" value={mockStats.students} icon="👨‍🎓" trend="+12" trendDirection="up" />
        <StatCard title="Tutors" value={mockStats.tutors} icon="👨‍🏫" trend="+3" trendDirection="up" />
        <StatCard title="Reviews" value={mockStats.reviews} icon="⭐" trend="+8" trendDirection="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Student Enrollment</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockBarData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="students" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Course Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {mockPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-start p-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
            >
              <div className="bg-primary/10 p-2 rounded-full mr-4">
                <span className="text-lg">🔔</span>
              </div>
              <div>
                <p className="font-medium">New student enrolled in your course</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">John Doe enrolled in "Advanced Mathematics"</p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

