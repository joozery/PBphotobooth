import React from 'react';

export default function FolderDetailDialog({ isOpen, onOpenChange, folder, onImageClick }) {
  if (!isOpen || !folder) return null;

  // mock images array
  const images = Array.from({ length: folder.itemsCount || 12 }, (_, i) => ({
    url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
    index: i + 1,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg max-w-6xl w-full p-6 relative min-h-[500px] flex flex-col">
        {/* Header */}
        <div className="mb-2 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">รวมภาพถ่ายงาน {folder.name}</h2>
            <div className="text-gray-500 text-sm">
              {folder.subtitle} • {folder.itemsCount} รายการ • {folder.event}
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
                  alt={`wish-${img.index}`}
                  className="w-full h-full object-cover rounded-lg opacity-0"
                  draggable={false}
                />
                <span className="absolute text-xs font-bold bg-gray-700 text-white px-2 py-1 rounded-lg left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-80">
                  {img.index}
                </span>
              </div>
            ))}
          </div>
          {/* Footer */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-gray-500 text-sm">
              แสดง {images.length} รายการจากทั้งหมด {images.length} รายการ
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium">
                <span className="material-icons text-base">download</span>
                ดาวน์โหลดทั้งหมด
              </button>
              <button className="flex items-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium">
                <span className="material-icons text-base">share</span>
                แชร์โฟลเดอร์
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 