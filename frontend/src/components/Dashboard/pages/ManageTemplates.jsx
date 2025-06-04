import React from "react";

export default function ManageTemplates({ onSelectPage }) {
  // TODO: ดึง template list จาก API
  const templates = [
    { id: 1, name: "ธีมชมพู", created_at: "2025-06-04" },
    { id: 2, name: "ธีมมินิมอล", created_at: "2025-06-03" },
  ];

  return (
    <div className="font-prompt">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-700">รายการเทมเพลต</h1>
        <button
          onClick={() => onSelectPage("template-builder")} // ✅ เปลี่ยนจาก navigate()
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow"
        >
          + สร้างเทมเพลตใหม่
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((tpl) => (
          <div key={tpl.id} className="p-4 bg-white rounded-xl shadow border">
            <h2 className="text-lg font-medium text-gray-800">{tpl.name}</h2>
            <p className="text-sm text-gray-500">สร้างเมื่อ: {tpl.created_at}</p>
          </div>
        ))}
      </div>
    </div>
  );
}