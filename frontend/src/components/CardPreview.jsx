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
  Shape,
} from "react-konva";
import { MdRefresh } from "react-icons/md";
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

  const groupRef = useRef();

  const [showShadow, setShowShadow] = useState(false);
  const [showStroke, setShowStroke] = useState(false);

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

  // จัดวางรูปให้อยู่กลางเฟรมและขนาดพอดีอัตโนมัติเมื่ออัปโหลดรูปใหม่หรือเปลี่ยน template
  useEffect(() => {
    if (userImage && imageElement) {
      const frameW = imageElement.width || 300;
      const frameH = imageElement.height || 400;
      const imgW = userImage.width;
      const imgH = userImage.height;
      const scale = Math.min(frameW / imgW, frameH / imgH, 1);
      const newW = imgW * scale;
      const newH = imgH * scale;
      setImgProps({
        x: imageElement.x + (frameW - newW) / 2,
        y: imageElement.y + (frameH - newH) / 2,
        width: newW,
        height: newH,
        cropX: 0,
        cropY: 0,
        cropWidth: 0,
        cropHeight: 0,
      });
    }
  }, [userImage, imageElement]);

  // จัดตำแหน่งข้อความให้อยู่ใน textbox อัตโนมัติเมื่อเปลี่ยน template
  useEffect(() => {
    if (template && textElement) {
      setWishMessagePos({
        x: textElement.x,
        y: textElement.y,
      });
      setTextWidth(textElement.width || 300);
      setFontSize(textElement.fontSize || 24);
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

  useEffect(() => {
    localStorage.setItem("showShadow", showShadow ? "true" : "false");
  }, [showShadow]);
  useEffect(() => {
    localStorage.setItem("showStroke", showStroke ? "true" : "false");
  }, [showStroke]);

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
                {/* Shadow (เงา) วาดก่อน Group เพื่อไม่ถูก clip */}
                {showShadow && (
                  <Rect
                    x={imgProps.x}
                    y={imgProps.y}
                    width={imgProps.width}
                    height={imgProps.height}
                    fill="transparent"
                    shadowColor="#888"
                    shadowBlur={24}
                    shadowOffsetX={12}
                    shadowOffsetY={12}
                    shadowOpacity={0.5}
                    listening={false}
                    cornerRadius={frameShape === "circle" ? imgProps.width / 2 : 0}
                  />
                )}
                {/* Stroke (ขอบ) วาดก่อน Group เพื่อไม่ถูก clip และตรงกับ frameShape */}
                {showStroke && (
                  <Shape
                    sceneFunc={(ctx, shape) => {
                      const w = imgProps.width;
                      const h = imgProps.height;
                      ctx.beginPath();
                      if (frameShape === "circle") {
                        const radius = Math.min(w, h) / 2;
                        ctx.arc(imgProps.x + w / 2, imgProps.y + h / 2, radius, 0, Math.PI * 2, false);
                      } else if (frameShape === "star") {
                        const cx = imgProps.x + w / 2;
                        const cy = imgProps.y + h / 2;
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
                      } else if (frameShape === "heart") {
                        // วาดหัวใจ
                        ctx.moveTo(imgProps.x + w / 2, imgProps.y + h * 0.8);
                        ctx.bezierCurveTo(imgProps.x + w * 1.1, imgProps.y + h * 0.5, imgProps.x + w * 0.8, imgProps.y + h * 0.05, imgProps.x + w / 2, imgProps.y + h * 0.3);
                        ctx.bezierCurveTo(imgProps.x + w * 0.2, imgProps.y + h * 0.05, imgProps.x - w * 0.1, imgProps.y + h * 0.5, imgProps.x + w / 2, imgProps.y + h * 0.8);
                        ctx.closePath();
                      } else if (frameShape === "hexagon") {
                        const cx = imgProps.x + w / 2;
                        const cy = imgProps.y + h / 2;
                        const r = Math.min(w, h) / 2;
                        ctx.moveTo(cx + r * Math.cos(0), cy + r * Math.sin(0));
                        for (let i = 1; i <= 6; i++) {
                          ctx.lineTo(
                            cx + r * Math.cos((i * 2 * Math.PI) / 6),
                            cy + r * Math.sin((i * 2 * Math.PI) / 6)
                          );
                        }
                        ctx.closePath();
                      } else if (frameShape === "cloud") {
                        ctx.arc(imgProps.x + w * 0.3, imgProps.y + h * 0.7, w * 0.18, Math.PI * 0.5, Math.PI * 1.5);
                        ctx.arc(imgProps.x + w * 0.5, imgProps.y + h * 0.5, w * 0.22, Math.PI, Math.PI * 2);
                        ctx.arc(imgProps.x + w * 0.7, imgProps.y + h * 0.7, w * 0.18, Math.PI * 1.5, Math.PI * 0.5);
                        ctx.closePath();
                      } else if (frameShape === "zigzag") {
                        const steps = 8;
                        const stepW = w / steps;
                        ctx.moveTo(imgProps.x, imgProps.y + h);
                        for (let i = 0; i < steps; i++) {
                          ctx.lineTo(imgProps.x + stepW * i + stepW / 2, imgProps.y + h - (i % 2 === 0 ? 20 : 0));
                          ctx.lineTo(imgProps.x + stepW * (i + 1), imgProps.y + h);
                        }
                        ctx.lineTo(imgProps.x + w, imgProps.y);
                        ctx.lineTo(imgProps.x, imgProps.y);
                        ctx.closePath();
                      } else {
                        // default: สี่เหลี่ยม
                        ctx.moveTo(imgProps.x, imgProps.y);
                        ctx.lineTo(imgProps.x + w, imgProps.y);
                        ctx.lineTo(imgProps.x + w, imgProps.y + h);
                        ctx.lineTo(imgProps.x, imgProps.y + h);
                        ctx.closePath();
                      }
                      ctx.closePath();
                      ctx.fillStrokeShape(shape);
                    }}
                    stroke="#000"
                    strokeWidth={4}
                    listening={false}
                  />
                )}
                {userImage && template && imageElement && (
                  <Group
                    ref={groupRef}
                    x={imgProps.x}
                    y={imgProps.y}
                    width={imgProps.width}
                    height={imgProps.height}
                    draggable
                    onDragEnd={e => setImgProps(prev => ({
                      ...prev,
                      x: e.target.x(),
                      y: e.target.y()
                    }))}
                    onTransformEnd={e => {
                      const node = groupRef.current;
                      const scaleX = node.scaleX();
                      const scaleY = node.scaleY();
                      setImgProps(prev => ({
                        ...prev,
                        x: node.x(),
                        y: node.y(),
                        width: Math.max(50, node.width() * scaleX),
                        height: Math.max(50, node.height() * scaleY)
                      }));
                      node.scaleX(1);
                      node.scaleY(1);
                    }}
                    clipFunc={ctx => {
                      const w = imgProps.width;
                      const h = imgProps.height;
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
                      } else if (frameShape === "heart") {
                        ctx.moveTo(w / 2, h * 0.8);
                        ctx.bezierCurveTo(w * 1.1, h * 0.5, w * 0.8, h * 0.05, w / 2, h * 0.3);
                        ctx.bezierCurveTo(w * 0.2, h * 0.05, -w * 0.1, h * 0.5, w / 2, h * 0.8);
                        ctx.closePath();
                      } else if (frameShape === "hexagon") {
                        const cx = w / 2;
                        const cy = h / 2;
                        const r = Math.min(w, h) / 2;
                        ctx.moveTo(cx + r * Math.cos(0), cy + r * Math.sin(0));
                        for (let i = 1; i <= 6; i++) {
                          ctx.lineTo(
                            cx + r * Math.cos((i * 2 * Math.PI) / 6),
                            cy + r * Math.sin((i * 2 * Math.PI) / 6)
                          );
                        }
                        ctx.closePath();
                      } else if (frameShape === "cloud") {
                        ctx.arc(w * 0.3, h * 0.7, w * 0.18, Math.PI * 0.5, Math.PI * 1.5);
                        ctx.arc(w * 0.5, h * 0.5, w * 0.22, Math.PI, Math.PI * 2);
                        ctx.arc(w * 0.7, h * 0.7, w * 0.18, Math.PI * 1.5, Math.PI * 0.5);
                        ctx.closePath();
                      } else if (frameShape === "zigzag") {
                        const steps = 8;
                        const stepW = w / steps;
                        ctx.moveTo(0, h);
                        for (let i = 0; i < steps; i++) {
                          ctx.lineTo(stepW * i + stepW / 2, h - (i % 2 === 0 ? 20 : 0));
                          ctx.lineTo(stepW * (i + 1), h);
                        }
                        ctx.lineTo(w, 0);
                        ctx.lineTo(0, 0);
                        ctx.closePath();
                      } else {
                        ctx.moveTo(0, 0);
                        ctx.lineTo(w, 0);
                        ctx.lineTo(w, h);
                        ctx.lineTo(0, h);
                        ctx.closePath();
                      }
                    }}
                    onClick={() => setSelected("image")}
                    onTap={() => setSelected("image")}
                  >
                    <KonvaImage
                      ref={imageRef}
                      image={userImage}
                      width={imgProps.width}
                      height={imgProps.height}
                    />
                  </Group>
                )}
                {selected === "image" && userImage && (
                  <Transformer
                    ref={tr => tr && tr.nodes([groupRef.current])}
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
                // รีเซ็ตตำแหน่ง/ขนาดรูปให้อยู่กลางเฟรมและขนาดพอดี
                if (userImage && imageElement) {
                  const frameW = imageElement.width || 300;
                  const frameH = imageElement.height || 400;
                  const imgW = userImage.width;
                  const imgH = userImage.height;
                  const scale = Math.min(frameW / imgW, frameH / imgH, 1);
                  const newW = imgW * scale;
                  const newH = imgH * scale;
                  setImgProps({
                    x: imageElement.x + (frameW - newW) / 2,
                    y: imageElement.y + (frameH - newH) / 2,
                    width: newW,
                    height: newH,
                    cropX: 0,
                    cropY: 0,
                    cropWidth: 0,
                    cropHeight: 0,
                  });
                }
                // รีเซ็ตข้อความให้อยู่ใน textbox
                if (textElement) {
                  setWishMessagePos({
                    x: textElement.x,
                    y: textElement.y,
                  });
                  setTextWidth(textElement.width || 300);
                  setFontSize(textElement.fontSize || 24);
                }
                setFontFamily("Prompt");
                setFontColor("#333333");
                setFrameShape("rectangle");
                setWishNamePos({
                  x: (textElement?.x || 0) + 42,
                  y: (textElement?.y || 0) + 20,
                });
              }}
              className="bg-white border px-4 py-2 rounded shadow-sm text-sm flex items-center gap-1"
            >
              <MdRefresh /> รีเซ็ท
            </button>
          </div>
          {/* เพิ่ม checkbox สำหรับเงาและขอบ */}
          <div className="flex gap-4 items-center mb-4">
            <label className="flex items-center gap-1 text-sm">
              <input type="checkbox" checked={showShadow} onChange={e => setShowShadow(e.target.checked)} />
              เพิ่มเงา
            </label>
            <label className="flex items-center gap-1 text-sm">
              <input type="checkbox" checked={showStroke} onChange={e => setShowStroke(e.target.checked)} />
              เพิ่มเส้นขอบ
            </label>
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
