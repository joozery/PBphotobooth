import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import { MdRefresh } from "react-icons/md";
import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";

// ✅ ใช้ custom useImage แทน import ที่พัง
const useImage = (url) => {
  const [image, setImage] = useState(null);
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => setImage(img);
  }, [url]);
  return [image];
};

export default function CardPreview() {
  const navigate = useNavigate();
  const [templateId, setTemplateId] = useState(1);
  const [imageURL, setImageURL] = useState("/sample-image.png");
  const [position, setPosition] = useState({ x: 60, y: 60 });
  const [scale, setScale] = useState(1);

  const [templateImage] = useImage(`/template${templateId}.jpg`);
  const [userImage] = useImage(imageURL);

  useEffect(() => {
    const savedTemplate = localStorage.getItem("templateId");
    const savedImage = localStorage.getItem("wishImage");
    if (savedTemplate) setTemplateId(parseInt(savedTemplate));
    if (savedImage) setImageURL(savedImage);
  }, []);

  const handleZoom = (type) => {
    setScale((prev) => (type === "in" ? prev + 0.1 : Math.max(0.5, prev - 0.1)));
  };

  const handleConfirm = () => {
    localStorage.setItem("wishPosition", JSON.stringify(position));
    localStorage.setItem("wishScale", scale.toString());
    navigate("/confirm");
  };

  const handleDragEnd = (e) => {
    setPosition({ x: e.target.x(), y: e.target.y() });
  };

  return (
    <div className="w-screen h-[100svh] bg-gray-100 font-prompt flex justify-center items-center">
      <div className="w-full max-w-sm h-[100svh] bg-white flex flex-col justify-between shadow-md overflow-auto">
        <div className="p-4 pb-0">
          <div className="text-center text-sm font-semibold text-blue-700 mb-1">
            ปรับแต่งตำแหน่งรูป (3/3)
          </div>
          <div className="text-xs text-center text-yellow-800 font-semibold py-1 mb-4 bg-yellow-100 rounded">
            DEMO สำหรับทดลองใช้งาน
          </div>

          <div className="relative w-full aspect-[3/2] bg-gray-100 border rounded-xl overflow-hidden mb-2">
            <Stage width={360} height={240} className="rounded-xl">
              <Layer>
                {templateImage && (
                  <KonvaImage
                    image={templateImage}
                    width={360}
                    height={240}
                  />
                )}
                {userImage && (
                  <KonvaImage
                    image={userImage}
                    x={position.x}
                    y={position.y}
                    width={144}
                    height={144}
                    scaleX={scale}
                    scaleY={scale}
                    draggable
                    onDragEnd={handleDragEnd}
                  />
                )}
              </Layer>
            </Stage>
          </div>

          <div className="bg-yellow-100 text-yellow-800 text-center text-xs font-medium px-4 py-2 rounded mb-4">
            ลากเพื่อปรับตำแหน่ง / ใช้ปุ่มด้านล่างเพื่อย่อ-ขยาย
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
