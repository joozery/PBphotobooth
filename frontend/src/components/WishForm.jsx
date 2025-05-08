import React, { useState } from "react";
import { FaUserTie, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // ✅ เพิ่มการ import

export default function WishForm() {
  const [side, setSide] = useState("groom");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(true);
  const [image, setImage] = useState(null);

  const navigate = useNavigate(); // ✅ ใช้งานเพื่อเปลี่ยนหน้า

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    // ✅ คุณสามารถส่งข้อมูลไปเก็บที่ global state หรือ localStorage ได้ตรงนี้
    // เช่น localStorage.setItem("wishData", JSON.stringify({ name, message, side, image }))
    navigate("/template"); // ✅ เปลี่ยนหน้าไปยังเลือกเทมเพลต
  };

  return (
    <div className="w-screen h-[100svh] bg-gradient-to-b from-yellow-100 to-white flex justify-center items-center font-prompt">
      <div className="w-full max-w-xl h-[100svh] bg-white overflow-auto shadow-xl border border-gray-200 animate-fade-in">
        <div className="p-4">
          <h1 className="text-center text-lg font-semibold text-yellow-600 mb-4">
            ส่งคำอวยพรของคุณ
          </h1>

          {/* 🖼️ Image Upload */}
          <div className="rounded-lg p-4 border border-dashed mb-4 bg-gray-50">
            <p className="text-sm text-center text-gray-500 mb-2">
              📷 *เลือกรูปแนวตั้ง 300x300px
            </p>
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
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          {/* 🔘 Select Side */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => setSide("groom")}
              className={`flex flex-col items-center p-3 rounded-lg border transition-all duration-200 ${
                side === "groom"
                  ? "border-blue-500 bg-blue-50 scale-105 shadow"
                  : "border-gray-300 bg-white hover:bg-gray-50"
              }`}
            >
              <FaUserTie
                className={`text-2xl mb-1 ${
                  side === "groom" ? "text-blue-500" : "text-gray-400"
                }`}
              />
              <span className="text-sm">ฝ่ายเจ้าบ่าว</span>
            </button>
            <button
              onClick={() => setSide("bride")}
              className={`flex flex-col items-center p-3 rounded-lg border transition-all duration-200 ${
                side === "bride"
                  ? "border-pink-500 bg-pink-50 scale-105 shadow"
                  : "border-gray-300 bg-white hover:bg-gray-50"
              }`}
            >
              <FaUser
                className={`text-2xl mb-1 ${
                  side === "bride" ? "text-pink-500" : "text-gray-400"
                }`}
              />
              <span className="text-sm">ฝ่ายเจ้าสาว</span>
            </button>
          </div>

          {/* 👤 Name Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-600">
              ชื่อ
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-300 transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              placeholder="ใส่ชื่อของคุณ"
            />
            <div className="text-xs text-right mt-1 text-gray-400">
              {name.length} / 20
            </div>
          </div>

          {/* 📝 Message */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-600">
              คำอวยพร
            </label>
            <textarea
              rows={4}
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-300 transition"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={200}
              placeholder="พิมพ์คำอวยพรของคุณ..."
            />
            <div className="text-xs text-right mt-1 text-gray-400">
              {message.length} / 200
            </div>
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

          {/* 🟦 Submit */}
          <button
            onClick={handleSubmit}
            className={`w-full py-3 rounded-full text-sm font-semibold text-white transition ${
              agree
                ? "bg-yellow-500 hover:bg-yellow-600 shadow-lg"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!agree}
          >
            ต่อไป →
          </button>
        </div>
      </div>
    </div>
  );
}
