import StatisticsCards from "@/app/(components)/dashboard/StatisticsCards"; 

export default function DashboardPage() {
  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500">Welcome to your task dashboard</p>
        </div>
        
        <StatisticsCards />
        
        {/* Additional dashboard components will go here */}
      </div>
  );
}