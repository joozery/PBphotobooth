import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoading, Oval } from "@agney/react-loading";
import { Stage, Layer, Image as KonvaImage, Text } from "react-konva";
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

  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState(null);
  const [stageWidth, setStageWidth] = useState(360);
  const [stageHeight, setStageHeight] = useState(240);

  // Local data
  const templateId = localStorage.getItem("templateId");
  const eventId = localStorage.getItem("eventId"); // ✅ ดึง eventId
  const image = localStorage.getItem("wishImage") || "/sample-image.png";
  const name = localStorage.getItem("wishName") || "ชื่อของคุณ";
  const message = localStorage.getItem("wishMessage") || "ข้อความอวยพรของคุณ...";
  const position = JSON.parse(localStorage.getItem("wishPosition") || '{"x":60,"y":60}');
  const scale = parseFloat(localStorage.getItem("wishScale") || "1");

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

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const ratio = 3 / 2;
      setStageWidth(containerWidth);
      setStageHeight(containerWidth / ratio);
    }
  }, []);

  const { containerProps, indicatorEl } = useLoading({
    loading,
    indicator: <Oval width="24" />,
  });

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("ส่งคำอวยพรเรียบร้อย!");
      navigate(`/thankyou/${eventId}`); // ✅ เปลี่ยนเส้นทางพร้อม eventId
    }, 1500);
  };

  return (
    <div className="w-screen h-[100svh] bg-black text-white font-prompt flex flex-col justify-center items-center px-4">
      <div
        ref={containerRef}
        className="bg-white rounded-xl shadow overflow-hidden max-w-sm w-full relative aspect-[3/2]"
      >
        <Stage width={stageWidth} height={stageHeight}>
          <Layer>
            {bgImage && <KonvaImage image={bgImage} width={stageWidth} height={stageHeight} />}
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
            {message && (
              <Text
                text={message}
                fontFamily="Prompt"
                x={template?.textbox_x || 0}
                y={(template?.textbox_y || 0) + 10}
                width={template?.textbox_width || 300}
                fontSize={16}
                fill="#333"
                align="center"
              />
            )}
            {name && (
              <Text
                text={`– ${name}`}
                x={template?.textbox_x || 0}
                y={(template?.textbox_y || 0) + 60}
                width={template?.textbox_width || 300}
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
          ยกเลิก
        </div>
      </div>
    </div>
  );
}