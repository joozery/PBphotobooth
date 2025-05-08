import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdRefresh } from "react-icons/md";
import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";

export default function CardPreview() {
  const navigate = useNavigate();
  const [templateId, setTemplateId] = useState(1);
  const [image, setImage] = useState("/sample-image.png");
  const [position, setPosition] = useState({ x: 60, y: 60 });
  const [scale, setScale] = useState(1);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const savedTemplate = localStorage.getItem("templateId");
    const savedImage = localStorage.getItem("wishImage");
    if (savedTemplate) setTemplateId(parseInt(savedTemplate));
    if (savedImage) setImage(savedImage);
  }, []);

  const handleMouseDown = () => setDragging(true);
  const handleMouseUp = () => setDragging(false);

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    setPosition({ x: offsetX - 72, y: offsetY - 72 });
  };

  const handleZoom = (type) => {
    setScale((prev) => (type === "in" ? prev + 0.1 : Math.max(0.5, prev - 0.1)));
  };

  const handleConfirm = () => {
    localStorage.setItem("wishPosition", JSON.stringify(position));
    localStorage.setItem("wishScale", scale.toString());
    navigate("/confirm"); // ไปหน้า preview/success
  };

  return (
    <div
      className="w-screen h-[100svh] bg-gray-100 font-prompt flex justify-center items-center"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="w-full max-w-sm h-[100svh] bg-white flex flex-col justify-between shadow-md overflow-auto">
        <div className="p-4 pb-0">
          <div className="text-center text-sm font-semibold text-blue-700 mb-1">
            ปรับแต่งตำแหน่งรูป (3/3)
          </div>
          <div className="text-xs text-center text-yellow-800 font-semibold py-1 mb-4 bg-yellow-100 rounded">
            DEMO สำหรับทดลองใช้งาน
          </div>

          <div
            ref={containerRef}
            className="relative w-full aspect-[3/2] bg-gray-100 border rounded-xl overflow-hidden mb-2"
          >
            <img
              src={`/template${templateId}.jpg`}
              alt="Template"
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
            <img
              src={image}
              onMouseDown={handleMouseDown}
              className="absolute w-36 h-36 rounded-lg border-2 border-blue-400 cursor-move transition-transform"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              }}
              alt="Uploaded"
            />
          </div>

          <div className="bg-yellow-100 text-yellow-800 text-center text-xs font-medium px-4 py-2 rounded mb-4">
            แตะที่รูปค้างไว้แล้วเลื่อน เพื่อปรับตำแหน่ง
          </div>

          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => setPosition({ x: 60, y: 60 })}
              className="bg-white border px-4 py-2 rounded shadow-sm text-sm flex items-center gap-1"
            >
              <MdRefresh /> รีเซ็ท
            </button>
            <button
              onClick={() => handleZoom("out")}
              className="bg-blue-600 text-white px-4 py-2 rounded shadow-sm text-sm flex items-center gap-1"
            >
              <AiOutlineZoomOut /> ย่อรูป
            </button>
            <button
              onClick={() => handleZoom("in")}
              className="bg-blue-600 text-white px-4 py-2 rounded shadow-sm text-sm flex items-center gap-1"
            >
              <AiOutlineZoomIn /> ขยายรูป
            </button>
          </div>
        </div>

        <div className="p-4 pt-0">
          <button
            onClick={handleConfirm}
            className="w-full bg-blue-700 text-white py-3 rounded-full font-semibold flex justify-center items-center gap-2 text-sm"
          >
            <FaCheck /> ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
}
