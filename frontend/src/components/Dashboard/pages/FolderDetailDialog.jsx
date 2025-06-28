import React from 'react';

export default function FolderDetailDialog({ isOpen, onOpenChange, folder, wishCards, onImageClick }) {
  if (!isOpen || !folder) return null;

  // ถ้ามี wishCards จริงให้ใช้ wishCards, ถ้าไม่มีก็ใช้ mockWishCards
  const mockWishCards = [
    {
      url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=280&fit=crop',
      name: 'คุณสมชาย',
      message: 'ขอให้มีความสุขมากๆ นะครับ',
      side: 'groom'
    },
    {
      url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=280&fit=crop',
      name: 'คุณสมหญิง',
      message: 'ขอให้รักกันตลอดไป',
      side: 'bride'
    },
    {
      url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=280&fit=crop',
      name: 'คุณพ่อ',
      message: 'ขอให้ลูกมีความสุขในชีวิตคู่',
      side: 'groom'
    },
    {
      url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=280&fit=crop',
      name: 'คุณแม่',
      message: 'ขอให้ลูกสาวมีความสุขมากๆ',
      side: 'bride'
    },
    {
      url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=280&fit=crop',
      name: 'เพื่อนร่วมงาน',
      message: 'ขอให้มีความสุขในชีวิตใหม่',
      side: 'groom'
    },
    {
      url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=280&fit=crop',
      name: 'เพื่อนสมัยเรียน',
      message: 'ขอให้รักกันตลอดไปนะ',
      side: 'bride'
    },
    {
      url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=280&fit=crop',
      name: 'ญาติผู้ใหญ่',
      message: 'ขอให้มีความสุขในชีวิตคู่',
      side: 'groom'
    },
    {
      url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=280&fit=crop',
      name: 'เพื่อนบ้าน',
      message: 'ขอให้รักกันตลอดไป',
      side: 'bride'
    },
    {
      url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=280&fit=crop',
      name: 'เพื่อนสนิท',
      message: 'ขอให้มีความสุขมากๆ',
      side: 'groom'
    },
    {
      url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=280&fit=crop',
      name: 'เพื่อนสมัยมหาวิทยาลัย',
      message: 'ขอให้รักกันตลอดไปนะ',
      side: 'bride'
    },
    {
      url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=280&fit=crop',
      name: 'เพื่อนร่วมทีม',
      message: 'ขอให้มีความสุขในชีวิตใหม่',
      side: 'groom'
    },
    {
      url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=280&fit=crop',
      name: 'เพื่อนสมัยเด็ก',
      message: 'ขอให้รักกันตลอดไป',
      side: 'bride'
    }
  ];

  const images = (wishCards && wishCards.length > 0
    ? wishCards.map((card, i) => ({
        url: card.url || card,
        name: card.name || `Guest ${i + 1}`,
        message: card.message || '',
        side: card.side || '',
        index: card.index || i + 1,
      }))
    : mockWishCards.slice(0, folder.itemsCount || 12).map((card, i) => ({
        url: card.url,
        name: card.name,
        message: card.message,
        side: card.side,
        index: i + 1,
      }))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg max-w-6xl w-full p-6 relative min-h-[500px] flex flex-col">
        {/* Header */}
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">รูป card อวยพรทั้งหมด - {folder.name}</h2>
            <div className="text-gray-500 text-sm">
              {folder.subtitle} • {folder.itemsCount} การ์ดอวยพร • {folder.event}
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-700 text-2xl font-bold px-2"
            aria-label="ปิด"
          >
            ×
          </button>
        </div>
        {/* Grid Images */}
        <div className="flex-1 flex flex-col">
          <div className="grid grid-cols-6 gap-8 py-8 flex-1">
            {images.map((img, idx) => (
              <div
                key={img.index}
                className="relative flex items-center justify-center aspect-square bg-gray-50 rounded-lg border border-gray-100 cursor-pointer hover:shadow-md"
                onClick={() => onImageClick(img.url, images.map(i => i.url), idx)}
              >
                <img
                  src={img.url}
                  alt={`wish-card-${img.index}`}
                  className="w-full h-full object-cover rounded-lg"
                  draggable={false}
                />
                <span className="absolute text-xs font-bold bg-pink-600 text-white px-2 py-1 rounded-lg left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-90">
                  {img.name}
                </span>
              </div>
            ))}
          </div>
          {/* Footer */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-gray-500 text-sm">
              แสดง {images.length} การ์ดอวยพรจากทั้งหมด {images.length} การ์ด
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium">
                <span className="material-icons text-base">download</span>
                ดาวน์โหลดการ์ดทั้งหมด
              </button>
              <button className="flex items-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium">
                <span className="material-icons text-base">share</span>
                แชร์การ์ดอวยพร
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 