import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoading, Oval } from "@agney/react-loading";
import { Group, Stage, Layer, Image as KonvaImage, Text, Shape, Rect } from "react-konva";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaUserTie,
  FaUser,
  FaStar,
  FaHeart,
  FaSmile,
  FaCat,
  FaDog,
  FaRing,
} from "react-icons/fa";
import { IoIosFemale, IoMdFemale } from "react-icons/io";
import beerIcon from "../assets/icons/beer.png";
import femaleIcon from "../assets/icons/female.png";
import maleIcon from "../assets/icons/male.png";
import manthaiIcon from "../assets/icons/manthai.png";
import thaicolorIcon from "../assets/icons/thaicolor.png";
import wineIcon from "../assets/icons/wine.png";
import womancolorIcon from "../assets/icons/womancolor.png";
import woomanthaiIcon from "../assets/icons/woomanthai.png";
import { useTranslation } from 'react-i18next';

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://pbphoto-api-fae29207c672.herokuapp.com";

const iconMap = {
  FaUser,
  FaUserTie,
  FaStar,
  FaHeart,
  FaSmile,
  FaCat,
  FaDog,
  FaRing,
  IoIosFemale,
  IoMdFemale,
};

const iconImageOptions = {
  beer: beerIcon,
  female: femaleIcon,
  male: maleIcon,
  manthai: manthaiIcon,
  thaicolor: thaicolorIcon,
  wine: wineIcon,
  womancolor: womancolorIcon,
  woomanthai: woomanthaiIcon,
};

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

export default function WishConfirm() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const messageRef = useRef();
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState(null);
  const [wishMessagePos, setWishMessagePos] = useState(null);
  const [event, setEvent] = useState(null);
  const stageRef = useRef();
  const { t } = useTranslation();

  const imageElement = template?.elements?.find((el) => el.type === "image");
  const textElement = template?.elements?.find((el) => el.type === "text");
  // Local data
  const templateId = localStorage.getItem("templateId");
  const eventId = localStorage.getItem("eventId");
  const image = localStorage.getItem("wishImage") || "/sample-image.png";
  const name = localStorage.getItem("wishName") || "ชื่อของคุณ";
  const message = localStorage.getItem("wishMessage") || "ข้อความอวยพรของคุณ...";
  const wishMessagePosValue = JSON.parse(localStorage.getItem("wishMessagePos") || '{"x":60,"y":60}');
  const wishMessageWidth = parseFloat(localStorage.getItem("wishMessageWidth") || "300");
  const wishFontSize = parseFloat(localStorage.getItem("wishFontSize") || "24");
  const fontFamily = localStorage.getItem("wishFontFamily") || "Prompt";
  const fontColor = localStorage.getItem("wishFontColor") || "#333";
  const frameShape = localStorage.getItem("wishFrameShape") || "rectangle";
  const scale = parseFloat(localStorage.getItem("wishScale") || "1");
  const imgProps = JSON.parse(localStorage.getItem("imgProps") || '{}');
  const side = localStorage.getItem("side");
  const agree = localStorage.getItem("agree");
  const wishNamePos = JSON.parse(localStorage.getItem("wishNamePos") || '{"x":42,"y":20}');
  const wishNameWidth = parseFloat(localStorage.getItem("wishNameWidth") || "150");
  const wishNameFontSize = parseFloat(localStorage.getItem("wishNameFontSize") || "12");
  const showShadow = localStorage.getItem("showShadow") === "true";
  const showStroke = localStorage.getItem("showStroke") === "true";

  // Image hooks
  const [userImage] = useImage(image);
  const [bgImage] = useImage(template?.background || "");
  const [textboxImage] = useImage(template?.textbox || "");
  const [frameImage] = useImage(template?.frame || "");

  // ใช้ wishMessagePosState สำหรับ state ภายใน component
  const [wishMessagePosState, setWishMessagePosState] = useState(wishMessagePosValue);
  const [wishMessageWidthState, setWishMessageWidthState] = useState(wishMessageWidth);
  const [wishFontSizeState, setWishFontSizeState] = useState(wishFontSize);

  // เพิ่มการดึง cover_image2 จาก template หรือ event
  const coverImage2 =
    event?.cover_image2 ||
    event?.coverImage2 ||
    template?.cover_image2 ||
    template?.coverImage2 ||
    null;

  // เพิ่มการดึง icon จาก event
  const groomIconKey = event?.groom_icon || "FaUserTie";
  const brideIconKey = event?.bride_icon || "FaUser";
  const GroomIcon = iconMap[groomIconKey] || FaUserTie;
  const BrideIcon = iconMap[brideIconKey] || FaUser;

  // เช็คว่ามี icon image หรือไม่
  const groomIconImage = event?.groom_icon_image || iconImageOptions[event?.groom_icon];
  const brideIconImage = event?.bride_icon_image || iconImageOptions[event?.bride_icon];

  const groomLabel = event?.groom_label || "ฝ่ายเจ้าบ่าว";
  const brideLabel = event?.bride_label || "ฝ่ายเจ้าสาว";

  useEffect(() => {
    if (templateId) {
      axios.get(`${BASE_URL}/api/templates/${templateId}`).then((res) => {
        setTemplate(res.data);
      });
    }
  }, [templateId]);

  useEffect(() => {
    if (eventId) {
      axios.get(`${BASE_URL}/api/events/${eventId}`).then((res) => {
        setEvent(res.data);
      });
    }
  }, [eventId]);

  const { containerProps, indicatorEl } = useLoading({
    loading,
    indicator: <Oval width="24" />,
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 1. Snapshot Stage เป็น JPEG
      const dataUrl = stageRef.current.toDataURL({ mimeType: "image/jpeg", quality: 1, pixelRatio: 3 });
      // 2. แปลง base64 เป็น Blob
      function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
      }
      const imageBlob = dataURLtoBlob(dataUrl);

      // 3. ส่งเฉพาะ image (snapshot) ไป backend
      const formData = new FormData();
      formData.append('image', imageBlob, 'wish.jpg'); // ส่งเฉพาะ snapshot
      formData.append('eventId', eventId);
      formData.append('name', name);
      formData.append('message', message);
      formData.append('side', side);
      formData.append('agree', agree); // ส่งข้อมูลการยินยอมให้แสดงในสไลด์โชว์

      await axios.post(`${BASE_URL}/api/wishes/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // ✅ ล้าง localStorage ที่เกี่ยวข้อง
      localStorage.removeItem("wishName");
      localStorage.removeItem("wishMessage");
      localStorage.removeItem("wishImage");
      localStorage.removeItem("wishPosition");
      localStorage.removeItem("wishScale");
      localStorage.removeItem("side");
      localStorage.removeItem("agree");
      localStorage.removeItem("templateId");
      localStorage.removeItem("wishMessagePos");
      localStorage.removeItem("wishMessageWidth");
      localStorage.removeItem("wishFontSize");
      localStorage.removeItem("wishFontFamily");
      localStorage.removeItem("wishFontColor");
      localStorage.removeItem("wishFrameShape");
      localStorage.removeItem("imgProps");
      localStorage.removeItem("wishNamePos");
      localStorage.removeItem("wishNameWidth");
      localStorage.removeItem("wishNameFontSize");
      localStorage.removeItem("showShadow");
      localStorage.removeItem("showStroke");

      await Swal.fire({
        icon: "success",
        title: "ส่งคำอวยพรเรียบร้อย!",
        showConfirmButton: false,
        timer: 1800
      });
      navigate(`/thankyou/${eventId}`);
    } catch (error) {
      console.error("❌ ส่งคำอวยพร error:", error);
      await Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการส่งคำอวยพร",
        text: error.message || "ไม่สามารถเชื่อมต่อ API ได้",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedPos = localStorage.getItem("wishMessagePos");
    if (savedPos) {
      setWishMessagePos(JSON.parse(savedPos));
    } else if (textElement) {
      setWishMessagePos({
        x: textElement.x,
        y: textElement.y,
      });
    }
  }, [template, textElement]);

  // เพิ่ม useEffect สำหรับ sync frameShape ลง localStorage
  useEffect(() => {
    if (frameShape) {
      localStorage.setItem("wishFrameShape", frameShape);
    }
  }, [frameShape]);

  // Sync state กับ localStorage ทุกครั้งที่ mount หรือ localStorage เปลี่ยน
  useEffect(() => {
    const syncFromLocalStorage = () => {
      const pos = JSON.parse(localStorage.getItem("wishMessagePos") || '{"x":60,"y":60}');
      const width = parseFloat(localStorage.getItem("wishMessageWidth") || "300");
      const fontSize = parseFloat(localStorage.getItem("wishFontSize") || "24");
      setWishMessagePosState(pos);
      setWishMessageWidthState(width);
      setWishFontSizeState(fontSize);
    };
    syncFromLocalStorage();
    window.addEventListener('storage', syncFromLocalStorage);
    return () => window.removeEventListener('storage', syncFromLocalStorage);
  }, []);

  return (
    <div
      className="w-screen h-[100svh] text-white font-prompt flex flex-col justify-center items-center px-4"
      style={{
        background: coverImage2
          ? `url(${coverImage2}) center center / cover no-repeat`
          : 'linear-gradient(to bottom right, #fef9c3, #bae6fd)',
      }}
    >
      <div
            className="text-sm text-blue-700 font-medium mb-1 cursor-pointer mb-3"
            onClick={() => navigate(-1)}
          >
            ← เลือกเทมเพลต (4/4)
          </div>
      <div
        ref={containerRef}
        className="relative w-full flex justify-center items-center overflow-hidden mb-3"
      >
        <Stage ref={stageRef} width={420} height={280} className="border">
          <Layer>
            {bgImage && <KonvaImage image={bgImage} width={420} height={280} />}
            {textboxImage && template && (
              <KonvaImage
                image={textboxImage}
                x={template.textbox_x + 10}
                y={template.textbox_y}
                scaleX={(() => {
                  const scaleX = template.textbox_width / textboxImage.width;
                  const scaleY = template.textbox_height / textboxImage.height;
                  return Math.min(scaleX, scaleY);
                })()}
                scaleY={(() => {
                  const scaleX = template.textbox_width / textboxImage.width;
                  const scaleY = template.textbox_height / textboxImage.height;
                  return Math.min(scaleX, scaleY);
                })()}
              />
            )}
            {message && template && wishMessagePosState && (
              <Text
                ref={messageRef}
                fontFamily={fontFamily}
                text={message}
                x={wishMessagePosState.x}
                y={wishMessagePosState.y}
                width={wishMessageWidthState}
                fontSize={wishFontSizeState}
                fill={fontColor}
                align="center"
                lineHeight={1.5}
                wrap="word"
              />
            )}

            {name && template && wishNamePos && (
              <Text
                fontFamily={fontFamily}
                text={`– ${name}`}
                x={wishNamePos.x}
                y={wishNamePos.y}
                width={wishNameWidth}
                fontSize={wishNameFontSize}
                fill={fontColor}
                fontStyle="600"
                align="left"
              />
            )}
            {userImage && template && imageElement && imgProps && imgProps.width && imgProps.height && (
              <Group
                x={imgProps.x}
                y={imgProps.y}
                draggable={false}
                scaleX={1}
                scaleY={1}
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
              >
                <KonvaImage
                  image={userImage}
                  x={imgProps.offsetX || 0}
                  y={imgProps.offsetY || 0}
                  width={imgProps.width}
                  height={imgProps.height}
                  crop={{
                    x: imgProps.cropX || 0,
                    y: imgProps.cropY || 0,
                    width: imgProps.cropWidth || userImage.width,
                    height: imgProps.cropHeight || userImage.height,
                  }}
                  draggable={false}
                />
              </Group>
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
          </Layer>
        </Stage>
      </div>

      {/* ปุ่ม */}
      <div className="mt-6 w-full max-w-sm">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2"
        >
          {loading ? (
            <span {...containerProps}>{indicatorEl}</span>
          ) : (
            <>{t('ส่งคำอวยพร')}</>
          )}
        </button>
        <div
          className="mt-4 text-center text-sm underline cursor-pointer text-blue-700 hover:text-blue-900"
          onClick={() => navigate(-1)}
        >
          {t('ย้อนกลับ')}
        </div>
      </div>
    </div>
  );
}
