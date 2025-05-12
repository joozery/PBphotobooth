// components/Dashboard/MainContent.jsx
import React from 'react';
import ManageEvents from './pages/ManageEvents';
import ManageWishes from './pages/ManageWishes';
import DashboardOverview from './pages/DashboardOverview.jsx'; // ✅ เพิ่มไฟล์นี้

function MainContent({ selectedPage }) {
  let content;
  switch (selectedPage) {
    case 'events':
      content = <ManageEvents />;
      break;
    case 'wishes':
      content = <ManageWishes />;
      break;
    default:
      content = <DashboardOverview />; // ✅ หน้าหลัก
  }

  return (
    <div className="flex-1 bg-gray-50 p-6">
      {content}
    </div>
  );
}

export default MainContent;
