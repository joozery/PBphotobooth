import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa"; // ใช้ icon ลบ

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://pbphoto-api-fae29207c672.herokuapp.com";

export default function ManageTemplates({ onSelectPage }) {
  const [templates, setTemplates] = useState([]);

  const fetchTemplates = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/templates`);
      setTemplates(res.data);
    } catch (err) {
      console.error("❌ โหลด templates ไม่สำเร็จ:", err);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบเทมเพลตนี้?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/templates/${id}`);
      setTemplates((prev) => prev.filter((tpl) => tpl.id !== id));
      alert("✅ ลบเทมเพลตสำเร็จแล้ว");
    } catch (err) {
      console.error("❌ ลบไม่สำเร็จ:", err);
      alert("เกิดข้อผิดพลาดในการลบ");
    }
  };

  return (
    <div className="font-prompt">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-700">รายการเทมเพลต</h1>
        <button
          onClick={() => onSelectPage({ page: "template-builder" })}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full shadow"
        >
          + สร้างเทมเพลตใหม่
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="relative p-4 bg-white rounded-xl shadow border hover:shadow-md transition"
          >
            {/* ปุ่มลบ */}
            <button
              onClick={() => handleDelete(tpl.id)}
              className="absolute top-2 right-2 text-red-600 hover:text-red-800"
              title="ลบเทมเพลต"
            >
              <FaTrash />
            </button>

            {/* preview และกดเพื่อแก้ไข */}
            <div
              onClick={() =>
                onSelectPage({ page: "template-builder", templateId: tpl.id })
              }
              className="cursor-pointer"
            >
              <div className="w-full h-[200px] relative overflow-hidden border rounded mb-3">
                {tpl.background && (
                  <img
                    src={tpl.background}
                    alt="bg"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                {tpl.textbox && (
                  <img
                    src={tpl.textbox}
                    alt="textbox"
                    className="absolute w-[200px] h-[80px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain"
                    style={{ zIndex: 2 }}
                  />
                )}
                {tpl.frame && (
                  <img
                    src={tpl.frame}
                    alt="frame"
                    className="absolute w-[80px] h-[80px] bottom-2 right-2 object-contain"
                    style={{ zIndex: 3 }}
                  />
                )}
              </div>

              <h2 className="text-lg font-medium text-gray-800">{tpl.name}</h2>
              <p className="text-sm text-gray-500">
                สร้างเมื่อ:{" "}
                {new Date(tpl.created_at).toLocaleDateString("th-TH")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}