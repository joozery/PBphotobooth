import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ ใช้สำหรับเปลี่ยนหน้า

const templates = [
  { id: 1, image: "/template1.jpg", label: "เลือกเทมเพลต #1" },
  { id: 2, image: "/template2.jpg", label: "เลือกเทมเพลต #2" },
  { id: 3, image: "/template3.jpg", label: "เลือกเทมเพลต #3" },
];

export default function TemplateSelect() {
  const navigate = useNavigate();

  const handleSelect = (id) => {
    localStorage.setItem("templateId", id); // ✅ บันทึก ID
    navigate("/preview"); // ✅ ไปหน้า preview
  };

  return (
    <div className="w-screen h-[100svh] bg-gray-50 flex justify-center items-center font-prompt">
      <div className="w-full max-w-lg h-[100svh] overflow-auto bg-white shadow-md border">
        <div className="p-4">
          {/* Header */}
          <div className="text-sm text-blue-700 font-medium mb-1">
            ← เลือกเทมเพลต (2/3)
          </div>

          {/* DEMO bar */}
          <div className="bg-yellow-100 text-xs text-yellow-700 text-center font-semibold py-1 mb-3 rounded">
            DEMO สำหรับทดลองใช้งาน
          </div>

          <p className="text-center text-xs text-gray-500 mb-4">
            – มี 3 เทมเพลตให้เลือก (เปลี่ยนตอนท้ายได้) –
          </p>

          {/* Templates */}
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="mb-5 rounded-xl overflow-hidden border border-gray-200 shadow-sm"
            >
              <img src={tpl.image} alt={`Template ${tpl.id}`} className="w-full" />
              <div className="p-3">
                <button
                  onClick={() => handleSelect(tpl.id)}
                  className="w-full py-2 bg-white border rounded-full shadow text-sm font-medium text-blue-600 hover:bg-blue-50 transition"
                >
                  {tpl.label}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
