import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Group,
  Stage,
  Layer,
  Image as KonvaImage,
  Text,
  Rect,
  Transformer,
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

const REMOVE_BG_API_KEY = "CNxCKtW7ASjw1GMNHPmo56Uz";

export default function CardPreview() {
  const messageRef = useRef();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [imageURL, setImageURL] = useState("/sample-image.png");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [wishName, setWishName] = useState("");
  const [wishMessage, setWishMessage] = useState("");
  const [wishMessagePos, setWishMessagePos] = useState(null);
  const [eventId, setEventId] = useState("");

  const [fontFamily, setFontFamily] = useState("Prompt"); // ฟอนต์เริ่มต้น
  const [fontColor, setFontColor] = useState("#333333"); // สีข้อความเริ่มต้น
  const [frameShape, setFrameShape] = useState("rectangle"); // rectangle, circle, star
  const [showBackground, setShowBackground] = useState(true); // ควบคุมการแสดง BG

  const imageElement = template?.elements?.find((el) => el.type === "image");
  const textElement = template?.elements?.find((el) => el.type === "text");

  const imageRef = useRef();
  const textRef = useRef();
  const [selected, setSelected] = useState(null);

  const [textWidth, setTextWidth] = useState(300); // กว้างเริ่มต้น
  const [fontSize, setFontSize] = useState(24); // ขนาดฟอนต์เริ่มต้น

  // --- state สำหรับ crop ---
  const [imgProps, setImgProps] = useState({
    x: imageElement?.x || 60,
    y: imageElement?.y || 20,
    width: imageElement?.width || 300,
    height: imageElement?.height || 400,
    cropX: 0,
    cropY: 0,
    cropWidth: 0,
    cropHeight: 0,
  });

  const [loadingRemoveBg, setLoadingRemoveBg] = useState(false);

  // --- เพิ่ม state สำหรับตำแหน่งชื่อ ---
  const [wishNamePos, setWishNamePos] = useState({ x: 0, y: 0 });

  const wishNameRef = useRef();
  const [wishNameWidth, setWishNameWidth] = useState(150);
  const [wishNameFontSize, setWishNameFontSize] = useState(12);

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
    localStorage.setItem("wishMessagePos", JSON.stringify(wishMessagePos));
    localStorage.setItem("wishFontFamily", fontFamily);
    localStorage.setItem("wishFontColor", fontColor);
    localStorage.setItem("wishFrameShape", frameShape);
    localStorage.setItem("wishMessageWidth", textWidth.toString());
    localStorage.setItem("wishFontSize", fontSize.toString());
    localStorage.setItem("imgProps", JSON.stringify(imgProps));
    localStorage.setItem("wishNamePos", JSON.stringify(wishNamePos));
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
    if (template && textElement) {
      // โหลด wishMessagePos
      const savedPos = localStorage.getItem("wishMessagePos");
      if (savedPos) {
        setWishMessagePos(JSON.parse(savedPos));
      } else {
        setWishMessagePos({
          x: textElement.x,
          y: textElement.y,
        });
      }

      // โหลด fontFamily
      const savedFontFamily = localStorage.getItem("wishFontFamily");
      if (savedFontFamily) setFontFamily(savedFontFamily);

      // โหลด fontColor
      const savedFontColor = localStorage.getItem("wishFontColor");
      if (savedFontColor) setFontColor(savedFontColor);

      // โหลด frameShape
      const savedFrameShape = localStorage.getItem("wishFrameShape");
      if (savedFrameShape) setFrameShape(savedFrameShape);

      // โหลด wishNamePos
      const savedNamePos = localStorage.getItem("wishNamePos");
      if (savedNamePos) {
        setWishNamePos(JSON.parse(savedNamePos));
      } else {
        setWishNamePos({
          x: (textElement.x || 0) + 42,
          y: (textElement.y || 0) + 20,
        });
      }
    }
  }, [template, textElement]);

  const handleRemoveBg = async () => {
    setLoadingRemoveBg(true);
    try {
      // แปลง base64 เป็นไฟล์ (ถ้ามี base64)
      const dataUrl = imageURL;
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "wish-image.png", { type: blob.type });
      const formData = new FormData();
      formData.append("image_file", file);
      formData.append("size", "auto");
      const res = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: { "X-Api-Key": REMOVE_BG_API_KEY },
        body: formData,
      });
      if (!res.ok) {
        alert("ลบพื้นหลังไม่สำเร็จ: " + (await res.text()));
        setLoadingRemoveBg(false);
        return;
      }
      const resultBlob = await res.blob();
      const url = URL.createObjectURL(resultBlob);
      setImageURL(url); // set ให้ userImage เป็นรูปที่ไดคัทแล้ว
      localStorage.setItem("wishImage", url); // เพิ่มบันทึก url ที่ไดคัทแล้ว
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการลบพื้นหลัง");
    }
    setLoadingRemoveBg(false);
  };

  return (
    <div className="w-screen h-[100svh] bg-gray-100 font-prompt flex justify-center items-center">
      <div className="w-full max-w-lg h-[100svh] bg-white flex flex-col justify-between shadow-md overflow-auto">
        {/* Header / Title */}
        <div className="p-4 pb-0">
          <div
            className="text-sm text-blue-700 font-medium mb-1 cursor-pointer mb-3"
            onClick={() => navigate(-1)}
          >
            ← เลือกเทมเพลต (3/4)
          </div>
          <div className="text-center text-sm font-semibold text-blue-700 mb-3">
            ปรับแต่งตำแหน่งรูป (3/4)
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
                {userImage && template && imageElement && (
                  <KonvaImage
                    ref={imageRef}
                    image={userImage}
                    x={imgProps.x}
                    y={imgProps.y}
                    width={imgProps.width}
                    height={imgProps.height}
                    draggable
                    onClick={() => setSelected("image")}
                    onTap={() => setSelected("image")}
                    onDragEnd={e => setImgProps(prev => ({ ...prev, x: e.target.x(), y: e.target.y() }))}
                    onTransformEnd={e => {
                      const node = imageRef.current;
                      const scaleX = node.scaleX();
                      const scaleY = node.scaleY();
                      setImgProps(prev => ({
                        ...prev,
                        x: node.x(),
                        y: node.y(),
                        width: Math.max(50, node.width() * scaleX),
                        height: Math.max(50, node.height() * scaleY),
                      }));
                      node.scaleX(1);
                      node.scaleY(1);
                    }}
                  />
                )}
                {selected === "image" && userImage && (
                  <Transformer
                    ref={tr => tr && tr.nodes([imageRef.current])}
                    enabledAnchors={[
                      "top-left", "top-right", "bottom-left", "bottom-right",
                      "middle-left", "middle-right", "top-center", "bottom-center"
                    ]}
                    boundBoxFunc={(oldBox, newBox) => {
                      if (newBox.width < 50 || newBox.height < 50) {
                        return oldBox;
                      }
                      return newBox;
                    }}
                  />
                )}
                {wishMessage && template && (
                  <Text
                    ref={textRef}
                    text={wishMessage}
                    x={wishMessagePos?.x}
                    y={wishMessagePos?.y}
                    width={textWidth}
                    fontSize={fontSize}
                    fontFamily={fontFamily}
                    fill={fontColor}
                    wrap="word"
                    align="center"
                    draggable
                    onClick={() => setSelected("text")}
                    onTap={() => setSelected("text")}
                    onDragEnd={e => setWishMessagePos({ x: e.target.x(), y: e.target.y() })}
                    onTransformEnd={e => {
                      const node = textRef.current;
                      setTextWidth(node.width() * node.scaleX());
                      setFontSize(fontSize * node.scaleY());
                      node.scaleX(1);
                      node.scaleY(1);
                    }}
                  />
                )}
                {selected === "text" && wishMessage && (
                  <Transformer
                    ref={tr => tr && tr.nodes([textRef.current])}
                    enabledAnchors={[
                      "top-left", "top-right", "bottom-left", "bottom-right",
                      "middle-left", "middle-right", "top-center", "bottom-center"
                    ]}
                    boundBoxFunc={(oldBox, newBox) => {
                      if (newBox.width < 50 || newBox.height < 20) {
                        return oldBox;
                      }
                      return newBox;
                    }}
                  />
                )}
                {wishName && template && (
                  <Text
                    ref={wishNameRef}
                    fontFamily={fontFamily}
                    text={`– ${wishName}`}
                    x={wishNamePos.x}
                    y={wishNamePos.y}
                    width={wishNameWidth}
                    fontSize={wishNameFontSize}
                    fill={fontColor}
                    fontStyle="600"
                    align="left"
                    draggable
                    onDragEnd={e => {
                      const newPos = { x: e.target.x(), y: e.target.y() };
                      setWishNamePos(newPos);
                      localStorage.setItem("wishNamePos", JSON.stringify(newPos));
                    }}
                    onClick={() => setSelected("wishName")}
                    onTap={() => setSelected("wishName")}
                    onTransformEnd={e => {
                      const node = wishNameRef.current;
                      setWishNameWidth(node.width() * node.scaleX());
                      setWishNameFontSize(wishNameFontSize * node.scaleY());
                      node.scaleX(1);
                      node.scaleY(1);
                    }}
                  />
                )}
                {selected === "wishName" && wishName && (
                  <Transformer
                    ref={tr => tr && tr.nodes([wishNameRef.current])}
                    enabledAnchors={[
                      "top-left", "top-right", "bottom-left", "bottom-right",
                      "middle-left", "middle-right", "top-center", "bottom-center"
                    ]}
                    boundBoxFunc={(oldBox, newBox) => {
                      if (newBox.width < 30 || newBox.height < 10) {
                        return oldBox;
                      }
                      return newBox;
                    }}
                  />
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
                setPosition({ x: imageElement?.x, y: imageElement?.y });
                setScale(1);
                setWishMessagePos({ x: textElement?.x || 0, y: textElement?.y || 0 });
                setFontFamily("Prompt");
                setFontColor("#333333");
                setFrameShape("rectangle");
                setWishNamePos({
                  x: (textElement?.x || 0) + 42,
                  y: (textElement?.y || 0) + 20,
                });
                setTextWidth(300);
                setFontSize(24);
                setImgProps({
                  x: imageElement?.x || 60,
                  y: imageElement?.y || 20,
                  width: imageElement?.width || 300,
                  height: imageElement?.height || 400,
                  cropX: 0,
                  cropY: 0,
                  cropWidth: 0,
                  cropHeight: 0,
                });
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
                onChange={(e) => setFrameShape(e.target.value)}
                className="text-sm border rounded p-1"
              >
                <option value="rectangle">สี่เหลี่ยม</option>
                <option value="circle">วงกลม</option>
                <option value="star">ดาว</option>
                <option value="heart">หัวใจ</option>
                <option value="hexagon">หกเหลี่ยม</option>
                <option value="cloud">เมฆ</option>
                <option value="zigzag">ฟันปลา</option>
              </select>
            </div>

            {/* ปุ่มลบ BG */}
            <button
              onClick={handleRemoveBg}
              className="bg-red-500 text-white text-xs px-3 py-1 rounded shadow-sm"
              disabled={loadingRemoveBg}
            >
              {loadingRemoveBg ? "กำลังลบ BG..." : "ลบ BG (ไดคัท)"}
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
