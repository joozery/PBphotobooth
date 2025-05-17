import React from 'react';
import ManageEvents from './pages/ManageEvents';
import ManageWishes from './pages/ManageWishes';
import DashboardOverview from './pages/DashboardOverview';
import SettingsEvent from './pages/SettingsEvent';
import CreateEvent from './pages/CreateEvent';

function MainContent({ selectedPage, onSelectPage }) {
  let content;

  switch (selectedPage) {
    case 'events':
      content = <ManageEvents onSelectPage={onSelectPage} />;
      break;
    case 'wishes':
      content = <ManageWishes />;
      break;
    case 'settings-event':
      content = <SettingsEvent />;
      break;
    case 'create-event':
      content = <CreateEvent />;
      break;
    default:
      content = <DashboardOverview />;
  }

  return (
    <div className="flex-1 h-[100svh] overflow-y-auto bg-gray-50 p-6">
      {content}
    </div>
  );
}

export default MainContent;
