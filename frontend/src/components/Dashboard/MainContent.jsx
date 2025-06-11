import React from 'react';
import ManageEvents from './pages/ManageEvents';
import ManageWishes from './pages/ManageWishes';
import DashboardOverview from './pages/DashboardOverview';
import SettingsEvent from './pages/SettingsEvent';
import CreateEvent from './pages/CreateEvent';
import ManageTemplates from './pages/ManageTemplates';
import TemplateBuilder from './pages/TemplateBuilder';
import ManageEventSlips from './pages/ManageEventSlips'; // ✅ เพิ่มตรงนี้
import WishGallery from './pages/WishGallery'; // ✅ เพิ่มหน้าใหม่

function MainContent({ selectedPage, onSelectPage }) {
  const page = typeof selectedPage === 'string' ? selectedPage : selectedPage?.page;
  const templateId = selectedPage?.templateId;
  const eventId = selectedPage?.eventId;

  let content;

  switch (page) {
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
    case 'manage-templates':
      content = <ManageTemplates onSelectPage={onSelectPage} />;
      break;
    case 'template-builder':
      content = (
        <TemplateBuilder
          templateId={templateId}
          onSelectPage={onSelectPage}
        />
      );
      break;
    case 'slip-summary': // ✅ แก้ตรงนี้ให้ตรงกับ Sidebar
      content = <ManageEventSlips eventId={eventId} />;
      break;
      case 'wish-gallery':
  content = <WishGallery onSelectPage={onSelectPage} />;
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