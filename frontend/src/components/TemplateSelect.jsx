import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://pbphoto-api-fae29207c672.herokuapp.com";

const MockData = [
  {
    id: 2,
    name: "test05",
    background:
      "https://res.cloudinary.com/dvwcxskzi/image/upload/v1747454837/pbphotobooth/background/7abdfaf3-853c-4ba3-9743-4505cc166958.jpg",
    frame:
      "https://res.cloudinary.com/dvwcxskzi/image/upload/v1747454876/pbphotobooth/frame/b2e6d45d-f80f-4455-a751-2a09f5cb954a.png",
    textbox:
      "https://res.cloudinary.com/dvwcxskzi/image/upload/v1747974322/pbphotobooth/textbox/3733128f-eb39-4738-b617-1da79b032cc0.png",
    textbox_x: 283,
    textbox_y: 68,
    textbox_width: 300,
    textbox_height: 257,
    textbox_rotate: 0,
    frame_x: 19,
    frame_y: 63,
    frame_width: 284,
    frame_height: 256,
  },
  {
    id: 3,
    name: "test 2",
    background:
      "https://res.cloudinary.com/dvwcxskzi/image/upload/v1747454837/pbphotobooth/background/7abdfaf3-853c-4ba3-9743-4505cc166958.jpg",
    frame: "",
    textbox: "",
    textbox_x: 300,
    textbox_y: 87,
    textbox_width: 300,
    textbox_height: 220,
    textbox_rotate: 0,
    frame_x: 0,
    frame_y: 99,
    frame_width: 556,
    frame_height: 211,
  },
  {
    id: 24,
    name: "001",
    background:
      "https://res.cloudinary.com/dvwcxskzi/image/upload/v1749653755/pbphotobooth/background/d6145c1f-31b6-43f9-a419-e3c739682989.jpg",
    frame: "",
    textbox: "",
    textbox_x: 283,
    textbox_y: 125,
    textbox_width: 300,
    textbox_height: 100,
    textbox_rotate: 0,
    frame_x: 48,
    frame_y: 104,
    frame_width: 200,
    frame_height: 200,
  },
];

export default function TemplateSelect() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [templates, setTemplates] = useState([]);

  // ✅ ดึงข้อมูลอวยพรจาก localStorage
  const name = localStorage.getItem("wishName") || "ชื่อของคุณ";
  const message =
    localStorage.getItem("wishMessage") || "ข้อความอวยพรของคุณ...";
  const userImage = localStorage.getItem("wishImage") || "/sample-image.png";

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/templates/event/${eventId}`
        );
        setTemplates(res.data);
      } catch (err) {
        console.error("❌ ไม่สามารถโหลด template ได้:", err);
      }
    };

    if (eventId) fetchTemplates();
  }, [eventId]);

  useEffect(() => {
    console.log(templates);
  });

  const handleSelect = (id) => {
    localStorage.setItem("templateId", id);
    navigate("/preview");
  };

  const getValidImage = (url) =>
    url && (url.startsWith("http") || url.startsWith("blob:"))
      ? url
      : "https://placehold.co/600x400";

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

          {MockData.map((tpl) => (
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
                <div
                  style={{
                    transform: `rotate(${tpl.textbox_rotate}deg)`,
                    top: `${tpl.textbox_y}px`,
                    left: `${tpl.textbox_x}px`,
                    width: `${tpl.textbox_width}px`,
                    height: `${tpl.textbox_height}px`,
                  }}
                  className={`absolute text-sm text-gray-800 z-20`}
                >
                  <p className="leading-snug break-words whitespace-pre-line">
                    {message}
                  </p>
                  <p className="mt-2 font-semibold text-xs text-gray-500">
                    – {name}
                  </p>
                </div>

                {/* รูปภาพผู้ใช้อัปโหลด */}
                <img
                  src={getValidImage(userImage)}
                  alt="user"
                  style={{
                    top: `${tpl.frame_y}px`,
                    left: `${tpl.frame_x}px`,
                    width: `${tpl.frame_width}px`,
                    height: `${tpl.frame_height}px`,
                  }}
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
