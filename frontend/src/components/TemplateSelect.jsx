import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://pbphoto-api-fae29207c672.herokuapp.com";

export default function TemplateSelect() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [templates, setTemplates] = useState([]);

  // ✅ ดึงข้อมูลอวยพรจาก localStorage
  const name = localStorage.getItem("wishName") || "ชื่อของคุณ";
  const message = localStorage.getItem("wishMessage") || "ข้อความอวยพรของคุณ...";
  const userImage = localStorage.getItem("wishImage") || "/sample-image.png";

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/templates/event/${eventId}`);
        setTemplates(res.data);
      } catch (err) {
        console.error("❌ ไม่สามารถโหลด template ได้:", err);
      }
    };

    if (eventId) fetchTemplates();
  }, [eventId]);

  const handleSelect = (id) => {
    localStorage.setItem("templateId", id);
    navigate("/preview");
  };

  const getValidImage = (url) =>
    url && (url.startsWith("http") || url.startsWith("blob:"))
      ? url
      : "https://via.placeholder.com/600x400?text=No+Preview";

  return (
    <div className="w-screen h-[100svh] bg-gray-50 flex justify-center items-center font-prompt">
      <div className="w-full max-w-lg h-[100svh] overflow-auto bg-white shadow-md border">
        <div className="p-4">
          <div className="text-sm text-blue-700 font-medium mb-1">
            ← เลือกเทมเพลต (2/3)
          </div>

          <p className="text-center text-xs text-gray-500 mb-4">
            – เทมเพลตที่ใช้ในงานนี้ –
          </p>

          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="mb-6 rounded-xl overflow-hidden border border-gray-200 shadow"
            >
              <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                {/* BG */}
                <img
                  src={getValidImage(tpl.background)}
                  alt="bg"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* ข้อความอวยพร */}
                <div className="absolute top-[20%] left-[10%] w-[50%] text-sm text-gray-800 z-20">
                  <p className="leading-snug break-words whitespace-pre-line">{message}</p>
                  <p className="mt-2 font-semibold text-xs text-gray-500">– {name}</p>
                </div>

                {/* รูปภาพผู้ใช้อัปโหลด */}
                <img
                  src={getValidImage(userImage)}
                  alt="user"
                  className="absolute bottom-[12%] right-[8%] w-24 h-24 object-cover rounded shadow border-2 border-white z-20"
                />

                {/* Textbox */}
                {tpl.textbox && (
                  <img
                    src={tpl.textbox}
                    alt="textbox"
                    className="absolute w-[200px] h-[80px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain z-10"
                  />
                )}

                {/* Frame */}
                {tpl.frame && (
                  <img
                    src={tpl.frame}
                    alt="frame"
                    className="absolute w-[80px] h-[80px] bottom-2 right-2 object-contain z-30"
                  />
                )}
              </div>

              <div className="p-3">
                <button
                  onClick={() => handleSelect(tpl.id)}
                  className="w-full py-2 bg-white border rounded-full shadow text-sm font-medium text-blue-600 hover:bg-blue-50 transition"
                >
                  {tpl.name || `เลือกเทมเพลต #${tpl.id}`}
                </button>
              </div>
            </div>
          ))}

          {templates.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-4">
              ยังไม่มีเทมเพลต
            </p>
          )}
        </div>
      </div>
    </div>
  );
}