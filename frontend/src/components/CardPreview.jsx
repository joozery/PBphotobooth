import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Group,
  Stage,
  Layer,
  Image as KonvaImage,
  Text,
  Rect,
} from "react-konva";
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
  const messageRef = useRef();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [imageURL, setImageURL] = useState("/sample-image.png");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [wishName, setWishName] = useState("");
  const [wishMessage, setWishMessage] = useState("");
  const [eventId, setEventId] = useState("");

  const [fontFamily, setFontFamily] = useState("Prompt"); // ฟอนต์เริ่มต้น
  const [fontColor, setFontColor] = useState("#333333"); // สีข้อความเริ่มต้น
  const [frameShape, setFrameShape] = useState("rectangle"); // rectangle, circle, star
  const [showBackground, setShowBackground] = useState(true); // ควบคุมการแสดง BG

  const imageElement = template?.elements?.find((el) => el.type === "image");
  const textElement = template?.elements?.find((el) => el.type === "text");

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
    setScale((prev) =>
      type === "in" ? prev + 0.1 : Math.max(0.5, prev - 0.1)
    );
  };

  const handleConfirm = () => {
    localStorage.setItem("wishPosition", JSON.stringify(position));
    localStorage.setItem("wishScale", scale.toString());

    if (eventId) {
      navigate("/confirm");
    } else {
      alert("❌ ไม่พบข้อมูล eventId กรุณากลับไปหน้าอวยพร");
    }
  };

  const handleDragEnd = (e) => {
    setPosition({ x: e.target.x(), y: e.target.y() });
  };

  useEffect(() => {
    if (template) {
      // const storedPos = localStorage.getItem("wishPosition");
      // if (!storedPos) {
      setPosition({
        x: imageElement?.x,
        y: imageElement?.y,
      });
      // }
    }
  }, [imageElement?.x, imageElement?.y, template]);

  return (
    <div className="w-screen h-[100svh] bg-gray-100 font-prompt flex justify-center items-center">
      <div className="w-full max-w-lg h-[100svh] bg-white flex flex-col justify-between shadow-md overflow-auto">
        {/* Header / Title */}
        <div className="p-4 pb-0">
          <div className="text-center text-sm font-semibold text-blue-700 mb-3">
            ปรับแต่งตำแหน่งรูป (3/3)
          </div>

          {/* Preview area */}
          <div className="relative w-full flex justify-center items-center overflow-hidden mb-3">
            <Stage width={420} height={280} className="border">
              <Layer>
                {bgImage && showBackground && (
                  <KonvaImage image={bgImage} width={420} height={280} />
                )}
                {textboxImage && template && (
                  <KonvaImage
                    image={textboxImage}
                    x={template.textbox_x + 10}
                    y={template.textbox_y}
                    scaleX={(() => {
                      const scaleX =
                        template.textbox_width / textboxImage.width;
                      const scaleY =
                        template.textbox_height / textboxImage.height;
                      return Math.min(scaleX, scaleY);
                    })()}
                    scaleY={(() => {
                      const scaleX =
                        template.textbox_width / textboxImage.width;
                      const scaleY =
                        template.textbox_height / textboxImage.height;
                      return Math.min(scaleX, scaleY);
                    })()}
                  />
                )}
                {wishMessage && template && (
                  <Text
                    ref={messageRef}
                    fontFamily={fontFamily} // 👈 เพิ่มตรงนี้
                    text={wishMessage}
                    x={textElement?.x} // เลียนแบบ padding-left / ml-3 ถ้าต้องการ
                    y={textElement?.y}
                    width={textElement?.width} // ลดให้ balance กับ x + ml
                    // height={100}
                    fontSize={textElement?.fontSize || 16}
                    fill={fontColor}
                    align="center" // คล้าย <p> ปกติใน HTML ที่ align left
                    lineHeight={1.5} // ปรับให้ดูสบายตา
                    wrap="word" // ตัดคำอัตโนมัติ
                  />
                )}

                {wishName && template && (
                  <Text
                    fontFamily={fontFamily} // 👈 เพิ่มตรงนี้
                    text={`– ${wishName}`}
                    x={
                      textElement?.x + 42 // ml-3
                    }
                    y={
                      messageRef.current
                        ? messageRef.current.getClientRect().y +
                          messageRef.current.getClientRect().height +
                          4
                        : (textElement?.y || 0) + (textElement?.height || 100)
                    }
                    width={textElement?.width || 300}
                    fontSize={12}
                    fill={fontColor}
                    fontStyle="600"
                    align="left"
                  />
                )}
                {userImage && template && imageElement && (
                  <Group
                    x={position.x}
                    y={position.y}
                    draggable
                    onDragEnd={handleDragEnd}
                    scaleX={scale}
                    scaleY={scale}
                    clipFunc={(ctx) => {
                      const w = imageElement.width;
                      const h = imageElement.height;

                      ctx.beginPath();
                      if (frameShape === "circle") {
                        const radius = Math.min(w, h) / 2;
                        ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2, false);
                      } else if (frameShape === "star") {
                        const cx = w / 2;
                        const cy = h / 2;
                        const spikes = 5;
                        const outerRadius = Math.min(w, h) / 2;
                        const innerRadius = outerRadius / 2.5;
                        let rot = (Math.PI / 2) * 3;
                        let step = Math.PI / spikes;

                        ctx.moveTo(cx, cy - outerRadius);
                        for (let i = 0; i < spikes; i++) {
                          ctx.lineTo(
                            cx + Math.cos(rot) * outerRadius,
                            cy + Math.sin(rot) * outerRadius
                          );
                          rot += step;

                          ctx.lineTo(
                            cx + Math.cos(rot) * innerRadius,
                            cy + Math.sin(rot) * innerRadius
                          );
                          rot += step;
                        }
                        ctx.lineTo(cx, cy - outerRadius);
                      } else {
                        const r = 4;
                        ctx.moveTo(r, 0);
                        ctx.lineTo(w - r, 0);
                        ctx.quadraticCurveTo(w, 0, w, r);
                        ctx.lineTo(w, h - r);
                        ctx.quadraticCurveTo(w, h, w - r, h);
                        ctx.lineTo(r, h);
                        ctx.quadraticCurveTo(0, h, 0, h - r);
                        ctx.lineTo(0, r);
                        ctx.quadraticCurveTo(0, 0, r, 0);
                      }
                      ctx.closePath();
                    }}
                  >
                    {/* วาด userImage ด้วย object-cover เหมือนเดิม */}
                    {(() => {
                      const iw = userImage.width;
                      const ih = userImage.height;
                      const cw = imageElement.width;
                      const ch = imageElement.height;

                      const imageRatio = iw / ih;
                      const containerRatio = cw / ch;

                      let width, height, offsetX, offsetY;

                      if (imageRatio > containerRatio) {
                        height = ch;
                        width = ch * imageRatio;
                        offsetX = (cw - width) / 2;
                        offsetY = 0;
                      } else {
                        width = cw;
                        height = cw / imageRatio;
                        offsetX = 0;
                        offsetY = (ch - height) / 2;
                      }

                      return (
                        <KonvaImage
                          image={userImage}
                          x={offsetX}
                          y={offsetY}
                          width={width}
                          height={height}
                        />
                      );
                    })()}
                  </Group>
                )}
                {frameImage && template && (
                  <>
                    <KonvaImage
                      image={frameImage}
                      x={template.frame_x}
                      y={template.frame_y}
                      width={template.frame_width}
                      height={template.frame_height}
                    />
                    <Rect
                      x={template.frame_x}
                      y={template.frame_y}
                      width={template.frame_width}
                      height={template.frame_height}
                      strokeWidth={4}
                    />
                  </>
                )}
              </Layer>
            </Stage>
          </div>

          {/* Instruction */}
          <div className="bg-yellow-100 text-yellow-800 text-center text-xs font-medium px-4 py-2 rounded mb-4">
            ลากเพื่อปรับตำแหน่ง / ใช้ปุ่มด้านล่างเพื่อย่อ-ขยาย
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => {
                setPosition({
                  x: imageElement?.x,
                  y: imageElement?.y,
                });
                setScale(1);
              }}
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
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {/* เลือกรูปร่างเฟรม */}
            <div className="flex items-center gap-1">
              <label className="text-sm">เฟรม:</label>
              <select
                value={frameShape}
                onChange={(e) => {
                  setFrameShape(e.target.value);
                  localStorage.setItem("FrameShape", e.target.value);
                }}
                className="text-sm border rounded p-1"
              >
                <option value="rectangle">สี่เหลี่ยม</option>
                <option value="circle">วงกลม</option>
                <option value="star">ดาว</option>
              </select>
            </div>

            {/* ปุ่มลบ BG */}
            <button
              onClick={() => setShowBackground((prev) => !prev)}
              className="bg-red-500 text-white text-xs px-3 py-1 rounded shadow-sm"
            >
              {showBackground ? "ลบ BG" : "แสดง BG"}
            </button>

            {/* เปลี่ยนฟอนต์ */}
            <div className="flex items-center gap-1">
              <label className="text-sm">ฟอนต์:</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="text-sm border rounded p-1"
              >
                <option value="Prompt">Prompt</option>
                <option value="Kanit">Kanit</option>
                <option value="Sarabun">Sarabun</option>
                <option value="Arial">Arial</option>
                <option value="Tahoma">Tahoma</option>
                <option value="Sriracha">Sriracha</option>{" "}
                {/* เพิ่มฟอนต์ Sriracha */}
              </select>
            </div>

            {/* เลือกสีฟอนต์ */}
            <div className="flex items-center gap-1">
              <label className="text-sm">สีฟอนต์:</label>
              <input
                type="color"
                value={fontColor}
                onChange={(e) => setFontColor(e.target.value)}
                className="w-8 h-8 p-0 border rounded"
              />
            </div>
          </div>
        </div>

        {/* Confirm button */}
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
