import type React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface AdminMetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
  description: string;
}

export function AdminMetricCard({
  title,
  value,
  change,
  trend,
  icon,
  description,
}: AdminMetricCardProps) {
  return (
    <Card className="border-slate-700 bg-slate-800 shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-slate-700 p-2 rounded-md">{icon}</div>
          <div
            className={`flex items-center text-sm font-medium ${
              trend === "up" ? "text-green-500" : "text-red-500"
            }`}
          >
            {change}
            {trend === "up" ? (
              <ArrowUpRight className="h-4 w-4 ml-1" />
            ) : (
              <ArrowDownRight className="h-4 w-4 ml-1" />
            )}
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-slate-400">{title}</h3>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-slate-400">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
