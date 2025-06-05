import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { FaImage, FaFont, FaSave, FaUndo, FaExchangeAlt } from "react-icons/fa";
import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://pbphoto-api-fae29207c672.herokuapp.com";

  export default function TemplateBuilder({ templateId }) {
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
    if (templateId) {
      fetchTemplate(templateId);
    }
  }, [templateId]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/card-assets`);
        const allAssets = res.data;
  
        setBackgrounds(allAssets.filter((item) => item.type === "background"));
        setTextboxes(allAssets.filter((item) => item.type === "textbox"));
        setFrames(allAssets.filter((item) => item.type === "frame"));
      } catch (err) {
        console.error("❌ โหลด assets ไม่สำเร็จ:", err);
      }
    };
  
    fetchAssets();
  }, []);
  
  const fetchTemplate = async (id) => {
    const res = await axios.get(`${BASE_URL}/api/templates/${id}`);
    const tpl = res.data;
  
    setTemplateName(tpl.name);
    setSelectedBg(tpl.background);
    setSelectedTextbox(tpl.textbox);
    setSelectedFrame(tpl.frame);
    setElements(tpl.elements || []);
  
    // โหลดตำแหน่ง frame
    setFramePos({ x: tpl.frame_x || 0, y: tpl.frame_y || 0 });
    setFrameSize({ width: tpl.frame_width || 200, height: tpl.frame_height || 200 });
  
    // โหลดตำแหน่ง textbox
    setTextboxProps({
      x: tpl.textbox_x || 50,
      y: tpl.textbox_y || 50,
      width: tpl.textbox_width || 300,
      height: tpl.textbox_height || 100,
      rotate: tpl.textbox_rotate || 0,
      flipped: false,
    });
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

  const [templateName, setTemplateName] = useState("");

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      alert("กรุณาตั้งชื่อเทมเพลตก่อน");
      return;
    }
  
    const payload = {
      name: templateName,
      background: selectedBg,
      frame: selectedFrame,
      textbox: selectedTextbox,
      elements,
      framePosition: framePos,     // ✅ เพิ่มตรงนี้
      frameSize: frameSize,        // ✅ เพิ่มตรงนี้
      textboxProps: textboxProps,  // ✅ เพิ่มตรงนี้
    };
  
    try {
      if (templateId) {
        // ✅ แก้ไขเทมเพลตเดิม
        await axios.put(`${BASE_URL}/api/templates/${templateId}`, payload);
        alert("✅ แก้ไขเทมเพลตเรียบร้อยแล้ว!");
      } else {
        // ✅ สร้างใหม่
        await axios.post(`${BASE_URL}/api/templates`, payload);
        alert("✅ บันทึกเทมเพลตเรียบร้อยแล้ว!");
      }
    } catch (err) {
      console.error("❌ บันทึกไม่สำเร็จ:", err);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    }
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
       
        {selected !== null && (
  <button
    onClick={() => {
      const updated = [...elements];
      updated.splice(selected, 1); // ลบ element ที่เลือก
      setElements(updated);
      setSelected(null);
    }}
    className="bg-red-600 text-white px-3 py-2 rounded"
  >
    ลบองค์ประกอบ
  </button>
)}

{selectedTextbox && (
  <button
    onClick={() => setSelectedTextbox("")}
    className="bg-red-500 text-white px-3 py-2 rounded"
  >
    ลบ Textbox
  </button>
)}

{selectedFrame && (
  <button
    onClick={() => setSelectedFrame("")}
    className="bg-red-500 text-white px-3 py-2 rounded"
  >
    ลบ Frame
  </button>
)}

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

        <input
  type="text"
  value={templateName}
  onChange={(e) => setTemplateName(e.target.value)}
  placeholder="ตั้งชื่อเทมเพลต"
  className="px-3 py-2 rounded border w-60"
/>

        <button onClick={handleSaveTemplate}
        className="ml-auto bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2">
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