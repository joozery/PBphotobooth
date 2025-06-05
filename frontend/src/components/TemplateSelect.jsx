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

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/templates/event/${eventId}`); // ✅ แบบนี้ถูกต้อง
        console.log("📦 templates", res.data);
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
    url && url.startsWith("http")
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
              className="mb-5 rounded-xl overflow-hidden border border-gray-200 shadow-sm"
            >
              <div className="w-full h-[200px] relative overflow-hidden bg-gray-100 border-b">
                <img
                  src={getValidImage(tpl.background)}
                  alt="bg"
                  className="absolute inset-0 w-full h-full object-cover"
                />
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