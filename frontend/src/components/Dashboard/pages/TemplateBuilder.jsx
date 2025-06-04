import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { FaImage, FaFont, FaSave, FaUndo, FaExchangeAlt } from "react-icons/fa";
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://pbphoto-api-fae29207c672.herokuapp.com";

export default function TemplateBuilder() {
  const [elements, setElements] = useState([]);
  const [selected, setSelected] = useState(null);

  const [backgrounds, setBackgrounds] = useState([]);
  const [frames, setFrames] = useState([]);
  const [textboxes, setTextboxes] = useState([]);
  const [selectedBg, setSelectedBg] = useState("");
  const [selectedTextbox, setSelectedTextbox] = useState("");
  const [textboxProps, setTextboxProps] = useState({
    x: 50,
    y: 50,
    width: 300,
    height: 100,
    rotate: 0,
    flipped: false,
  });

  const [selectedFrame, setSelectedFrame] = useState("");
  const [framePos, setFramePos] = useState({ x: 0, y: 0 });
  const [frameSize, setFrameSize] = useState({ width: 200, height: 200 });

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/card-assets`);
      const bg = res.data.filter((item) => item.type === "background");
      const frame = res.data.filter((item) => item.type === "frame");
      const textbox = res.data.filter((item) => item.type === "textbox");
      setBackgrounds(bg);
      setFrames(frame);
      setTextboxes(textbox);
    } catch (err) {
      console.error("❌ โหลด assets ไม่สำเร็จ:", err);
    }
  };

  const addText = () => {
    setElements((prev) => [
      ...prev,
      {
        type: "text",
        text: "ข้อความใหม่",
        x: 50,
        y: 50,
        width: 150,
        height: 40,
        fontSize: 16,
      },
    ]);
  };

  const addImage = () => {
    setElements((prev) => [
      ...prev,
      {
        type: "image",
        src: "/sample-image.png",
        x: 100,
        y: 100,
        width: 100,
        height: 100,
      },
    ]);
  };

  const updateElement = (index, updates) => {
    const updated = [...elements];
    updated[index] = { ...updated[index], ...updates };
    setElements(updated);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-prompt">
      <div className="bg-white shadow p-4 flex gap-4 items-center flex-wrap">
        <button
          onClick={addText}
          className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaFont /> เพิ่มข้อความ
        </button>
        <button
          onClick={addImage}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <FaImage /> เพิ่มรูปภาพ
        </button>

        <select
          onChange={(e) => setSelectedBg(e.target.value)}
          className="px-3 py-2 rounded border"
        >
          <option value="">เลือกพื้นหลัง</option>
          {backgrounds.map((bg) => (
            <option key={bg.id} value={bg.url}>
              {bg.filename}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setSelectedTextbox(e.target.value)}
          className="px-3 py-2 rounded border"
        >
          <option value="">เลือก Textbox</option>
          {textboxes.map((tb) => (
            <option key={tb.id} value={tb.url}>
              {tb.filename}
            </option>
          ))}
        </select>

        <button
          onClick={() =>
            setTextboxProps((prev) => ({
              ...prev,
              rotate: (prev.rotate + 15) % 360,
            }))
          }
          className="bg-yellow-500 text-white px-3 py-1 rounded"
        >
          <FaUndo /> หมุน
        </button>
        <button
          onClick={() =>
            setTextboxProps((prev) => ({
              ...prev,
              flipped: !prev.flipped,
            }))
          }
          className="bg-orange-500 text-white px-3 py-1 rounded"
        >
          <FaExchangeAlt /> พลิก
        </button>

        <select
          onChange={(e) => setSelectedFrame(e.target.value)}
          className="px-3 py-2 rounded border"
        >
          <option value="">เลือกเฟรม</option>
          {frames.map((f) => (
            <option key={f.id} value={f.url}>
              {f.filename}
            </option>
          ))}
        </select>

        <button className="ml-auto bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <FaSave /> บันทึกเทมเพลต
        </button>
      </div>

      <div className="flex justify-center items-center flex-1 p-6 bg-gradient-to-br from-pink-50 to-purple-100">
        <div className="relative w-[600px] h-[400px] bg-white border shadow-lg overflow-hidden">
          {selectedBg && (
            <img
              src={selectedBg}
              alt="bg"
              className="absolute w-full h-full object-cover"
              style={{ zIndex: 0 }}
            />
          )}

          {selectedTextbox && (
            <Rnd
              size={{ width: textboxProps.width, height: textboxProps.height }}
              position={{ x: textboxProps.x, y: textboxProps.y }}
              onDragStop={(e, d) => setTextboxProps((prev) => ({ ...prev, x: d.x, y: d.y }))}
              onResizeStop={(e, dir, ref, delta, pos) => {
                setTextboxProps({
                  ...textboxProps,
                  width: parseInt(ref.style.width),
                  height: parseInt(ref.style.height),
                  x: pos.x,
                  y: pos.y,
                });
              }}
              bounds="parent"
              style={{
                zIndex: 2,
                transform: `rotate(${textboxProps.rotate}deg) scaleX(${textboxProps.flipped ? -1 : 1})`,
              }}
            >
              <img
                src={selectedTextbox}
                alt="textbox"
                className="w-full h-full object-contain pointer-events-none"
              />
            </Rnd>
          )}

          {elements.map((el, index) => (
            <Rnd
              key={index}
              size={{ width: el.width, height: el.height }}
              position={{ x: el.x, y: el.y }}
              onDragStop={(e, d) => updateElement(index, { x: d.x, y: d.y })}
              onResizeStop={(e, dir, ref, delta, pos) => {
                updateElement(index, {
                  width: parseInt(ref.style.width),
                  height: parseInt(ref.style.height),
                  x: pos.x,
                  y: pos.y,
                });
              }}
              bounds="parent"
              onClick={() => setSelected(index)}
              style={{ zIndex: 2 }}
            >
              {el.type === "text" ? (
                <div className="bg-transparent w-full h-full">
                  <input
                    className="w-full h-full text-center border-none outline-none text-black bg-transparent"
                    value={el.text}
                    onChange={(e) => updateElement(index, { text: e.target.value })}
                    style={{ fontSize: el.fontSize }}
                  />
                </div>
              ) : (
                <img
                  src={el.src}
                  className="w-full h-full object-cover rounded"
                  alt="element"
                />
              )}
            </Rnd>
          ))}

          {selectedFrame && (
            <Rnd
              size={frameSize}
              position={framePos}
              onDragStop={(e, d) => setFramePos({ x: d.x, y: d.y })}
              onResizeStop={(e, dir, ref, delta, pos) => {
                setFrameSize({
                  width: parseInt(ref.style.width),
                  height: parseInt(ref.style.height),
                });
                setFramePos({ x: pos.x, y: pos.y });
              }}
              bounds="parent"
              style={{ zIndex: 3 }}
            >
              <img
                src={selectedFrame}
                alt="frame"
                className="w-full h-full object-contain pointer-events-none"
              />
            </Rnd>
          )}
        </div>
      </div>
    </div>
  );
}