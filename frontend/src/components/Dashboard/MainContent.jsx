import React from 'react';
import ManageEvents from './pages/ManageEvents';
import ManageWishes from './pages/ManageWishes';
import DashboardOverview from './pages/DashboardOverview';
import SettingsEvent from './pages/SettingsEvent';
import CreateEvent from './pages/CreateEvent';
import ManageTemplates from './pages/ManageTemplates'; // ✅ เพิ่มหน้านี้แทน
import TemplateBuilder from './pages/TemplateBuilder'; // ✅ หน้าสร้างจริง

function MainContent({ selectedPage, onSelectPage }) {
  let content;

  switch (selectedPage) {
    case 'events':
      content = <ManageEvents onSelectPage={onSelectPage} />;
      break;
      case 'wishes': // แก้จาก ManageWishes → ManageTemplates
      content = <ManageTemplates />;
      break;
    case 'settings-event':
      content = <SettingsEvent />;
      break;
    case 'create-event':
      content = <CreateEvent />;
      break;
    case 'manage-templates': // ✅ list เทมเพลต
    content = <ManageTemplates onSelectPage={onSelectPage} />;
      break;
    case 'template-builder': // ✅ หน้าสร้าง template
      content = <TemplateBuilder />;
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