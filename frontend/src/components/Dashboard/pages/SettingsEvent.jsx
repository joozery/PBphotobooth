import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUpload, FaEye, FaTrash } from "react-icons/fa";



const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://pbphoto-api-fae29207c672.herokuapp.com";

export default function SettingsEvent() {
  const [uploads, setUploads] = useState({
    background: [],
    textbox: [],
    frame: [],
  });

  // โหลดข้อมูลเมื่อเปิดหน้า
  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/card-assets`);
      const grouped = { background: [], textbox: [], frame: [] };
      res.data.forEach((item) => {
        if (grouped[item.type]) {
          grouped[item.type].push({
            id: item.id,
            name: item.filename,
            url: item.url,
            date: new Date(item.uploaded_at).toLocaleDateString("th-TH"),
          });
        }
      });
      setUploads(grouped);
    } catch (err) {
      console.error("❌ โหลดรายการผิดพลาด:", err);
    }
  };

  const handleUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const res = await axios.post(`${BASE_URL}/api/card-assets/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newFile = {
        id: res.data.id,
        name: res.data.filename,
        url: res.data.url,
        date: new Date().toLocaleDateString("th-TH"),
      };

      setUploads((prev) => ({
        ...prev,
        [type]: [newFile, ...prev[type]],
      }));
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("อัปโหลดไม่สำเร็จ");
    }
  };

  const handleDelete = async (type, id) => {
    try {
      await axios.delete(`${BASE_URL}/api/card-assets/${id}`);
      setUploads((prev) => ({
        ...prev,
        [type]: prev[type].filter((item) => item.id !== id),
      }));
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  };

  const sections = [
    { title: "พื้นหลังการ์ดอวยพร", type: "background", color: "blue" },
    { title: "Textbox แสดงคำอวยพร", type: "textbox", color: "yellow" },
    { title: "กรอบ (Frame) การ์ดอวยพร", type: "frame", color: "purple" },
  ];

  return (
    <div className="mx-auto p-6 font-prompt">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">🛠️ ตั้งค่าการ์ดอวยพร</h1>

      <div className="grid gap-10">
        {sections.map(({ title, type, color }) => (
          <div key={type} className="border rounded-xl bg-white shadow-md overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className={`text-lg font-semibold text-${color}-600`}>
                {title}
              </h2>

              <label
                className={`bg-${color}-100 hover:bg-${color}-200 text-${color}-700 font-medium text-sm px-4 py-1.5 rounded-full shadow cursor-pointer transition-all`}
              >
                <FaUpload className="inline mr-1" />
                อัปโหลด
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpload(e, type)}
                />
              </label>
            </div>

            {/* Table */}
            {uploads[type].length === 0 ? (
              <p className="p-6 text-sm text-gray-400 italic">
                ยังไม่มีไฟล์ที่อัปโหลด
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="text-left px-6 py-3">Preview</th>
                      <th className="text-left px-6 py-3">ชื่อไฟล์</th>
                      <th className="text-left px-6 py-3">วันที่อัปโหลด</th>
                      <th className="text-center px-6 py-3">การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uploads[type].map((file) => (
                      <tr
                        key={file.id}
                        className="border-t hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-3">
                          <img
                            src={file.url}
                            alt="preview"
                            className="w-16 h-16 object-cover rounded shadow"
                          />
                        </td>
                        <td className="px-6 py-3">{file.name}</td>
                        <td className="px-6 py-3">{file.date}</td>
                        <td className="px-6 py-3 text-center space-x-3">
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaEye />
                          </a>
                          <button
                            onClick={() => handleDelete(type, file.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
