import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Stage, Layer, Image as KonvaImage, Text } from "react-konva";
import { MdRefresh } from "react-icons/md";
import { AiOutlineZoomIn, AiOutlineZoomOut } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import axios from "axios";

const useImage = (url) => {
  const [image, setImage] = useState(null);
  useEffect(() => {
    if (!url) return;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => setImage(img);
  }, [url]);
  return [image];
};

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://pbphoto-api-fae29207c672.herokuapp.com";

export default function CardPreview() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [template, setTemplate] = useState(null);
  const [imageURL, setImageURL] = useState("/sample-image.png");
  const [position, setPosition] = useState({ x: 60, y: 60 });
  const [scale, setScale] = useState(1);
  const [stageWidth, setStageWidth] = useState(360);
  const [stageHeight, setStageHeight] = useState(240);
  const [wishName, setWishName] = useState("");
  const [wishMessage, setWishMessage] = useState("");
  const [eventId, setEventId] = useState("");

  useEffect(() => {
    const savedTemplateId = localStorage.getItem("templateId");
    const savedImage = localStorage.getItem("wishImage");
    const savedPos = localStorage.getItem("wishPosition");
    const savedScale = localStorage.getItem("wishScale");
    const savedName = localStorage.getItem("wishName");
    const savedMessage = localStorage.getItem("wishMessage");
    const savedEventId = localStorage.getItem("eventId");

    if (savedImage) setImageURL(savedImage);
    if (savedPos) setPosition(JSON.parse(savedPos));
    if (savedScale) setScale(parseFloat(savedScale));
    if (savedName) setWishName(savedName);
    if (savedMessage) setWishMessage(savedMessage);
    if (savedEventId) setEventId(savedEventId);
    if (savedTemplateId) fetchTemplate(parseInt(savedTemplateId));
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const aspectRatio = 3 / 2;
      setStageWidth(containerWidth);
      setStageHeight(containerWidth / aspectRatio);
    }
  }, []);

  const fetchTemplate = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/templates/${id}`);
      setTemplate(res.data);
    } catch (err) {
      console.error("❌ โหลดเทมเพลตไม่สำเร็จ:", err);
    }
  };

  const [userImage] = useImage(imageURL);
  const [bgImage] = useImage(template?.background || "");
  const [textboxImage] = useImage(template?.textbox || "");
  const [frameImage] = useImage(template?.frame || "");

  const handleZoom = (type) => {
    setScale((prev) => (type === "in" ? prev + 0.1 : Math.max(0.5, prev - 0.1)));
  };

  const handleConfirm = () => {
    localStorage.setItem("wishPosition", JSON.stringify(position));
    localStorage.setItem("wishScale", scale.toString());

    if (eventId) {
      navigate("/confirm"); // ✅ ไปหน้า WishConfirm.jsx
    } else {
      alert("❌ ไม่พบข้อมูล eventId กรุณากลับไปหน้าอวยพร");
    }
  };

  const handleDragEnd = (e) => {
    setPosition({ x: e.target.x(), y: e.target.y() });
  };

  return (
    <div className="w-screen h-[100svh] bg-gray-100 font-prompt flex justify-center items-center">
      <div className="w-full max-w-lg h-[100svh] bg-white flex flex-col justify-between shadow-md overflow-auto">
        <div className="p-4 pb-0">
          <div className="text-center text-sm font-semibold text-blue-700 mb-1">
            ปรับแต่งตำแหน่งรูป (3/3)
          </div>

          <div
            ref={containerRef}
            className="relative w-full aspect-[3/2] bg-gray-100 border rounded-xl overflow-hidden mb-2"
          >
            <Stage width={stageWidth} height={stageHeight} className="rounded-xl">
              <Layer>
                {bgImage && (
                  <KonvaImage image={bgImage} width={stageWidth} height={stageHeight} />
                )}
                {textboxImage && template && (
                  <KonvaImage
                    image={textboxImage}
                    x={template.textbox_x}
                    y={template.textbox_y}
                    width={template.textbox_width}
                    height={template.textbox_height}
                    rotation={template.textbox_rotate}
                  />
                )}
                {wishMessage && template && (
  <Text
    fontFamily="Prompt"
    text={wishMessage}
    x={template.textbox_x || 0}
    y={template.textbox_y || 0}
    width={template.textbox_width || 300}
    height={template.textbox_height || 100}
    fontSize={16}
    fill="#333"
    align="center"
    verticalAlign="middle"
    wrap="word"
  />
)}

{wishName && template && (
  <Text
    fontFamily="Prompt"
    text={`– ${wishName}`}
    x={template.textbox_x || 0}
    y={(template.textbox_y || 0) + (template.textbox_height || 100) - 20}
    width={template.textbox_width || 300}
    fontSize={14}
    fill="#888"
    align="right"
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
                {frameImage && template && (
                  <KonvaImage
                    image={frameImage}
                    x={template.frame_x}
                    y={template.frame_y}
                    width={template.frame_width}
                    height={template.frame_height}
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