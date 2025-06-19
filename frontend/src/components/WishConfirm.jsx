import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoading, Oval } from "@agney/react-loading";
import { Group, Stage, Layer, Image as KonvaImage, Text } from "react-konva";
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://pbphoto-api-fae29207c672.herokuapp.com";

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

  const imageElement = template?.elements?.find((el) => el.type === "image");
  const textElement = template?.elements?.find((el) => el.type === "text");
  // Local data
  const templateId = localStorage.getItem("templateId");
  const eventId = localStorage.getItem("eventId"); // ✅ ดึง eventId
  const image = localStorage.getItem("wishImage") || "/sample-image.png";
  const name = localStorage.getItem("wishName") || "ชื่อของคุณ";
  const message =
    localStorage.getItem("wishMessage") || "ข้อความอวยพรของคุณ...";
  const position = JSON.parse(
    localStorage.getItem("wishPosition") || '{"x":60,"y":60}'
  );
  const scale = parseFloat(localStorage.getItem("wishScale") || "1");
  const side = localStorage.getItem("side");
  const agree = localStorage.getItem("agree");

  // Image hooks
  const [userImage] = useImage(image);
  const [bgImage] = useImage(template?.background || "");
  const [textboxImage] = useImage(template?.textbox || "");
  const [frameImage] = useImage(template?.frame || "");

  useEffect(() => {
    if (templateId) {
      axios.get(`${BASE_URL}/api/templates/${templateId}`).then((res) => {
        setTemplate(res.data);
      });
    }
  }, [templateId]);

  const { containerProps, indicatorEl } = useLoading({
    loading,
    indicator: <Oval width="24" />,
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("message", message);
      formData.append("side", side || "groom");
      formData.append("agreement", agree.toString() || "true");
      formData.append("eventId", eventId);

      const res = await fetch(image);
      const blob = await res.blob();
      formData.append("image", blob, "wish-image.png");

      const response = await axios.post(`${BASE_URL}/api/wishes`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        // ✅ ล้าง localStorage ที่เกี่ยวข้อง
        localStorage.removeItem("wishName");
        localStorage.removeItem("wishMessage");
        localStorage.removeItem("wishImage");
        localStorage.removeItem("wishPosition");
        localStorage.removeItem("wishScale");
        localStorage.removeItem("side");
        localStorage.removeItem("agree");
        localStorage.removeItem("templateId");
        alert("ส่งคำอวยพรเรียบร้อย!");
        navigate(`/thankyou/${eventId}`);
      } else {
        alert("เกิดข้อผิดพลาดในการส่งคำอวยพร");
      }
    } catch (error) {
      console.error("❌ ส่งคำอวยพร error:", error);
      alert("เกิดข้อผิดพลาดในการส่งคำอวยพร");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedPos = localStorage.getItem("wishMessagePos");
    if (savedPos) {
      setWishMessagePos(JSON.parse(savedPos));
    } else if (textElement) {
      // ถ้าไม่มี localStorage ให้ใช้ค่าเริ่มต้นจาก template
      setWishMessagePos({
        x: textElement.x,
        y: textElement.y,
      });
    }
  }, [template, textElement]);

  return (
    <div className="w-screen h-[100svh] bg-gray-100 text-white font-prompt flex flex-col justify-center items-center px-4">
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
        <Stage width={420} height={280}>
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
            {message && template && (
              <Text
                ref={messageRef}
                fontFamily={localStorage.getItem("wishFontFamily") || "Prompt"}
                text={message}
                x={wishMessagePos.x}
                y={wishMessagePos.y}
                width={textElement?.width} // ลดให้ balance กับ x + ml
                // height={100}
                fontSize={textElement?.fontSize || 16}
                fill={localStorage.getItem("wishFontColor") || "#333"}
                align="center" // คล้าย <p> ปกติใน HTML ที่ align left
                lineHeight={1.5} // ปรับให้ดูสบายตา
                wrap="word" // ตัดคำอัตโนมัติ
              />
            )}

            {name && template && (
              <Text
                fontFamily={localStorage.getItem("wishFontFamily") || "Prompt"}
                text={`– ${name}`}
                x={wishMessagePos.x + 42}
                y={
                  messageRef.current
                    ? messageRef.current.getClientRect().y +
                      messageRef.current.getClientRect().height +
                      4
                    : wishMessagePos.y + 20
                }
                width={textElement?.width || 300}
                fontSize={12}
                fill={localStorage.getItem("wishFontColor") || "#333"}
                fontStyle="600"
                align="left"
              />
            )}
            {userImage && template && imageElement && (
              <Group
                x={position.x}
                y={position.y}
                scaleX={scale}
                scaleY={scale}
                clipFunc={(ctx) => {
                  const w = imageElement.width;
                  const h = imageElement.height;
                  ctx.beginPath();
                  if (localStorage.getItem("wishFrameShape") === "circle") {
                    const radius = Math.min(w, h) / 2;
                    ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2, false);
                  } else if (
                    localStorage.getItem("wishFrameShape") === "star"
                  ) {
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
                {userImage &&
                  (() => {
                    // คำนวณ object-cover
                    const iw = userImage.width;
                    const ih = userImage.height;
                    const cw = imageElement.width;
                    const ch = imageElement.height;

                    const imageRatio = iw / ih;
                    const containerRatio = cw / ch;

                    let width, height, offsetX, offsetY;

                    if (imageRatio > containerRatio) {
                      // ภาพกว้างเกินไป → fit height
                      height = ch;
                      width = ch * imageRatio;
                      offsetX = (cw - width) / 2;
                      offsetY = 0;
                    } else {
                      // ภาพแคบเกินไป → fit width
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
            <>ส่งคำอวยพร</>
          )}
        </button>
        <div
          className="mt-4 text-center text-sm underline cursor-pointer"
          onClick={() => navigate(-1)}
        >
          ย้อนกลับ
        </div>
      </div>
    </div>
  );
}
