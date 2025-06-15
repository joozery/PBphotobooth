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

  const handleSelect = (id) => {
    localStorage.setItem("templateId", id);
    navigate("/preview");
  };

  // const getValidImage = (url) => {
  //   if (!url || !url.trim()) return "https://placehold.co/420x280";
  //   if (url.startsWith("http")) return url;
  //   if (url.startsWith("blob:")) {
  //     try {
  //       // ลอง preload รูป (optional)
  //       const img = new Image();
  //       img.src = url;
  //       return url;
  //     } catch {
  //       return "https://placehold.co/420x280";
  //     }
  //   }
  //   return "https://placehold.co/420x280";
  // };

  const getValidImage = (url) => {
  if (!url || !url.trim()) {
    return "https://placehold.co/420x280";
  }

  // ถ้าเป็น http หรือ https
  if (url.startsWith("http")) {
    return url;
  }

  // ถ้าเป็น base64 (data:image/...)
  if (url.startsWith("data:image")) {
    return url;
  }

  // ถ้าเป็น blob
  if (url.startsWith("blob:")) {
    return url; 
  }

  // fallback
  return "https://placehold.co/420x280";
};


  return (
    <div className="w-screen h-[100svh] bg-gray-50 flex justify-center items-center font-prompt">
      <div className="w-full max-w-lg h-[100svh] overflow-auto bg-white shadow-md border">
        <div className="p-4">
          <div
            className="text-sm text-blue-700 font-medium mb-1 cursor-pointer"
            onClick={() => navigate(-1)}
          >
            ← เลือกเทมเพลต (2/3)
          </div>

          <p className="text-center text-xs text-gray-500 mb-4">
            – เทมเพลตที่ใช้ในงานนี้ –
          </p>

          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="flex flex-col justify-center items-center mb-6 overflow-hidden"
            >
              <div
                className="relative bg-gray-100 overflow-hidden shadow-md rounded-md"
                style={{
                  width: "420px",
                  height: "280px",
                  position: "relative",
                }}
              >
                {/* BG */}
                <img
                  src={getValidImage(tpl.background)}
                  alt="bg"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* User image */}
                {/* <img
                  src={getValidImage(userImage)}
                  alt="user"
                  style={{
                    position: "absolute",
                    top: `${tpl.frame_y || 0}px`,
                    left: `${tpl.frame_x || 0}px`,
                    width: `${tpl.frame_width || 100}px`,
                    height: `${tpl.frame_height || 100}px`,
                  }}
                  className="object-cover rounded shadow border-2 border-white z-20"
                /> */}

                {/* Frame */}
                {tpl.frame && (
                  <img
                    src={tpl.frame}
                    alt="frame"
                    style={{
                      position: "absolute",
                      top: `${tpl.frame_y || 0}px`,
                      left: `${tpl.frame_x || 0}px`,
                      width: `${tpl.frame_width || 100}px`,
                      height: `${tpl.frame_height || 100}px`,
                    }}
                    className="object-contain z-30 pointer-events-none"
                  />
                )}

                {/* Textbox */}
                {tpl.textbox && (
                  <img
                    src={tpl.textbox}
                    alt="textbox"
                    style={{
                      position: "absolute",
                      top: `${tpl.textbox_y || 0}px`,
                      left: `${tpl.textbox_x || 0}px`,
                      width: `${tpl.textbox_width || 300}px`,
                      height: `${tpl.textbox_height || 100}px`,
                      transform: `rotate(${tpl.textbox_rotate || 0}deg)`,
                      zIndex: 1,
                    }}
                    className="object-contain z-10 pointer-events-none"
                  />
                )}

                {/* Text content */}
                {/* <div
                  style={{
                    position: "absolute",
                    top: `${tpl.textbox_y || 0}px`,
                    left: `${tpl.textbox_x || 0}px`,
                    width: `${tpl.textbox_width || 300}px`,
                    height: `${tpl.textbox_height || 100}px`,
                    transform: `rotate(${tpl.textbox_rotate || 0}deg)`,
                  }}
                  className="text-sm text-gray-800 z-20 overflow-hidden"
                >
                  <p className="leading-snug break-words whitespace-pre-line">
                    {message}
                  </p>
                  <p className="mt-2 font-semibold text-xs text-gray-500">
                    – {name}
                  </p>
                </div> */}

                {/* Elements */}
                {tpl.elements?.map((el, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: "absolute",
                      top: `${el.y}px`,
                      left: `${el.x}px`,
                      width: `${el.width}px`,
                      height: `${el.height}px`,
                      zIndex: 10,
                    }}
                  >
                    {el.type === "text" ? (
                      <div
                        style={{
                          fontSize: `${el.fontSize}px`,
                          color: "#333",
                          textAlign: "center",
                          width: `${el.width}px`,
                          height: "100%",
                        }}
                        className="text-wrap break-words pointer-events-none"
                      >
                        <p className="leading-snug break-words text-base whitespace-pre-line">
                          {message}
                        </p>
                        <p className="ml-3 font-semibold text-[12px] text-gray-500">
                          – {name}
                        </p>
                      </div>
                    ) : (
                      <img
                        // src={el.src}
                        src={getValidImage(userImage)}
                        alt="el"
                        className="w-full h-full object-cover rounded pointer-events-none"
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="w-full p-3">
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
