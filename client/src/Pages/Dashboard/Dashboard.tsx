import React, { memo } from "react";
import DashboardSidenav from "../../Components/Dashboard/DashboardSidenav";
import DashNav from "../../Components/Dashboard/DashNav";

const Dashboard = memo(() => {
  return (
    <div className="min-h-screen">
      <div className="hidden md:block">
        <DashNav />
      </div>
      <DashboardSidenav />
    </div>
  );
});

export default Dashboard;
