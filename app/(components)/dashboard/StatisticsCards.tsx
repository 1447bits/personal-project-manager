// app/components/dashboard/StatisticsCards.tsx
'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTaskStats } from '@/app/hooks/useTaskStats';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  BarChart2 
} from 'lucide-react';

export default function StatisticsCards() {
  const { data: stats, isLoading } = useTaskStats();

  if (isLoading) {
    return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="h-20 bg-gray-200" />
          <CardContent className="h-12 bg-gray-100" />
        </Card>
      ))}
    </div>;
  }

  const cards = [
    {
      title: "Total Tasks",
      value: stats?.total || 0,
      description: "Active tasks",
      icon: <BarChart2 className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Completed",
      value: stats?.completed || 0,
      description: "Tasks completed",
      icon: <CheckCircle2 className="h-6 w-6 text-green-600" />,
    },
    {
      title: "In Progress",
      value: stats?.pending || 0,
      description: "Tasks in progress",
      icon: <Clock className="h-6 w-6 text-orange-600" />,
    },
    {
      title: "High Priority",
      value: stats?.byPriority.high || 0,
      description: "Urgent tasks",
      icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              {card.title}
            </CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-gray-500">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}