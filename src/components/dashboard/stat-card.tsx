import { ArrowDown, ArrowUp } from "lucide-react"

interface StatCardProps {
  title: string
  value: number
  icon: string
  trend: string
  trendDirection: "up" | "down" | "neutral"
}

export default function StatCard({ title, value, icon, trend, trendDirection }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className="text-2xl bg-primary/10 p-2 rounded-full">{icon}</div>
      </div>

      <div className="flex items-center">
        <span
          className={`flex items-center text-sm ${
            trendDirection === "up" ? "text-green-600" : trendDirection === "down" ? "text-red-600" : "text-gray-600"
          }`}
        >
          {trendDirection === "up" && <ArrowUp className="w-4 h-4 mr-1" />}
          {trendDirection === "down" && <ArrowDown className="w-4 h-4 mr-1" />}
          {trend}
        </span>
        <span className="text-xs text-gray-500 ml-2">vs last month</span>
      </div>
    </div>
  )
}

