"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Building2, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface DepartmentStatsProps {
  total: number;
  active: number;
  inactive: number;
}

export function DepartmentStats({ total, active, inactive }: DepartmentStatsProps) {
  const stats = [
    {
      title: "Total Departments",
      value: total,
      icon: Building2,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Active Departments",
      value: active,
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/30",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Inactive Departments",
      value: inactive,
      icon: XCircle,
      color: "from-gray-500 to-gray-600",
      bgColor: "bg-gray-50 dark:bg-gray-950/30",
      textColor: "text-gray-600 dark:text-gray-400",
    },
    {
      title: "Active Rate",
      value: total > 0 ? `${Math.round((active / total) * 100)}%` : "0%",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
      textColor: "text-purple-600 dark:text-purple-400",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                </div>
                <div className={cn("p-3 rounded-full", stat.bgColor)}>
                  <Icon className={cn("w-6 h-6", stat.textColor)} />
                </div>
              </div>
              <div
                className={cn(
                  "absolute bottom-0 left-0 h-1 bg-gradient-to-r",
                  stat.color
                )}
                style={{ width: `${(active / total) * 100}%` }}
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}