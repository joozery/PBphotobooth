import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  FaUserTie, FaUser, FaStar, FaHeart, FaSmile, FaCat, FaDog, FaRing,
} from "react-icons/fa";
import { IoIosFemale, IoMdFemale } from "react-icons/io";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://pbphoto-api-fae29207c672.herokuapp.com";

// ✅ map สำหรับชื่อ → icon
const iconMap = {
  FaUser, FaUserTie, FaStar, FaHeart, FaSmile, FaCat, FaDog, FaRing,
  IoIosFemale, IoMdFemale,
};

export default function WishForm() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [side, setSide] = useState("groom");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(true);
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/events/${eventId}`);
        setEvent(res.data);
      } catch (err) {
        console.error("❌ โหลดข้อมูล event ผิดพลาด:", err);
      }
    };
    if (eventId) fetchEvent();
  }, [eventId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!agree) return;

    const formData = new FormData();
    formData.append("side", side);
    formData.append("name", name);
    formData.append("message", message);
    formData.append("agree", agree);
    formData.append("eventId", eventId);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await fetch(`${BASE_URL}/api/wishes`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        navigate("/template");
      } else {
        alert("❌ ส่งคำอวยพรไม่สำเร็จ");
      }
    } catch (err) {
      console.error("API error:", err);
      alert("❌ เกิดข้อผิดพลาดในการเชื่อมต่อ API");
    }
  };

  const groomLabel = event?.groom_label || "ฝ่ายเจ้าบ่าว";
  const brideLabel = event?.bride_label || "ฝ่ายเจ้าสาว";
  const buttonBg = event?.wish_button_bg || "#facc15";
  const buttonTextColor = event?.wish_button_text_color || "#ffffff";

  const groomIconKey = event?.groom_icon || "FaUserTie";
  const brideIconKey = event?.bride_icon || "FaUser";
  const GroomIcon = iconMap[groomIconKey] || FaUserTie;
  const BrideIcon = iconMap[brideIconKey] || FaUser;

  return (
    <div
    className="w-screen h-[100svh] bg-cover bg-center flex justify-center items-center font-prompt"
    style={{
      backgroundImage: event?.cover_image
        ? `url(${event.cover_image})`
        : "linear-gradient(to bottom, #fef3c7, #ffffff)", // fallback gradient
    }}
  >
      <div className="w-full max-w-xl h-[100svh] bg-white overflow-auto shadow-xl border border-gray-200 animate-fade-in">
        <div className="p-4">
          <h1 className="text-center text-lg font-semibold text-black-600 mb-4">ส่งคำอวยพรของคุณ</h1>

          {/* 📷 Image */}
          <div className="rounded-lg p-4 border border-dashed mb-4 bg-gray-50">
            <p className="text-sm text-center text-gray-500 mb-2">📷 *เลือกรูปแนวตั้ง 300x300px</p>
            <div className="flex justify-center">
              <img
                src={image || "/sample-image.png"}
                alt="Uploaded"
                className="w-32 h-32 rounded-lg object-cover border shadow"
              />
            </div>
            <div className="mt-3 flex justify-center">
              <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-sm px-4 py-1 rounded-full shadow transition">
                เปลี่ยนรูป
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          {/* 🔘 Side Select */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => setSide("groom")}
              className={`flex flex-col items-center p-3 rounded-lg border transition-all duration-200 ${
                side === "groom" ? "border-blue-500 bg-blue-50 scale-105 shadow" : "border-gray-300 bg-white hover:bg-gray-50"
              }`}
            >
              <GroomIcon className={`text-2xl mb-1 ${side === "groom" ? "text-blue-500" : "text-gray-400"}`} />
              <span className="text-sm">{groomLabel}</span>
            </button>
            <button
              onClick={() => setSide("bride")}
              className={`flex flex-col items-center p-3 rounded-lg border transition-all duration-200 ${
                side === "bride" ? "border-pink-500 bg-pink-50 scale-105 shadow" : "border-gray-300 bg-white hover:bg-gray-50"
              }`}
            >
              <BrideIcon className={`text-2xl mb-1 ${side === "bride" ? "text-pink-500" : "text-gray-400"}`} />
              <span className="text-sm">{brideLabel}</span>
            </button>
          </div>

          {/* 👤 Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-600">ชื่อ</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-300 transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              placeholder="ใส่ชื่อของคุณ"
            />
            <div className="text-xs text-right mt-1 text-gray-400">{name.length} / 20</div>
          </div>

          {/* 📝 Message */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-600">คำอวยพร</label>
            <textarea
              rows={4}
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-300 transition"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={200}
              placeholder="พิมพ์คำอวยพรของคุณ..."
            />
            <div className="text-xs text-right mt-1 text-gray-400">{message.length} / 200</div>
          </div>

          {/* ✅ Checkbox */}
          <label className="flex items-center gap-2 mb-6 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
              className="accent-yellow-400"
            />
            ยืนยันว่าคำอวยพรของฉันเหมาะสมต่อการแสดงผล
          </label>

          {/* ✅ Submit Button */}
          <button
            onClick={handleSubmit}
            className={`w-full py-3 rounded-full text-sm font-semibold transition ${
              agree ? "shadow-lg" : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!agree}
            style={{
              backgroundColor: agree ? buttonBg : "#d1d5db",
              color: agree ? buttonTextColor : "#888",
            }}
          >
            ต่อไป →
          </button>
        </div>
      </div>
    </div>
  );
}