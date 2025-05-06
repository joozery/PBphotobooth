import React, { useState } from "react";
import { FaUserTie, FaUser } from "react-icons/fa";

export default function WishForm() {
  const [side, setSide] = useState("groom");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(true);

  return (
    <div className="w-screen h-[100svh] bg-gray-100 flex justify-center items-center font-prompt">
      <div className="w-full max-w-sm h-[100svh] bg-white overflow-auto shadow-md rounded-none">
        <div className="p-4">
          <h1 className="text-center text-sm text-yellow-600 font-semibold mb-2">
          </h1>

          {/* 🖼️ Image Upload */}
          <div className="rounded-lg p-4 border mb-4">
            <p className="text-sm text-center mb-2">
              📷 *แนะนำให้เลือกรูปตั้งตรงเพื่อความสวยงาม 300x300px
            </p>
            <div className="flex justify-center">
              <img
                src="/sample-image.png"
                alt="Uploaded"
                className="w-32 h-32 rounded-lg object-cover border"
              />
            </div>
            <div className="mt-3 flex justify-center">
              <button className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-1 rounded shadow">
                เปลี่ยนรูป
              </button>
            </div>
          </div>

          {/* 🔘 Select Side */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => setSide("groom")}
              className={`flex flex-col items-center p-2 rounded-lg border ${
                side === "groom" ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
            >
              <FaUserTie className="text-2xl mb-1" />
              <span className="text-sm">ฝ่ายเจ้าบ่าว</span>
            </button>
            <button
              onClick={() => setSide("bride")}
              className={`flex flex-col items-center p-2 rounded-lg border ${
                side === "bride" ? "border-pink-500 bg-pink-50" : "border-gray-300"
              }`}
            >
              <FaUser className="text-2xl mb-1" />
              <span className="text-sm">ฝ่ายเจ้าสาว</span>
            </button>
          </div>

          {/* 👤 Name Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">ชื่อ</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              placeholder="ใส่ชื่อของคุณ"
            />
            <div className="text-xs text-right mt-1">{name.length} / 20</div>
          </div>

          {/* 📝 Message */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">คำอวยพร</label>
            <textarea
              rows={4}
              className="w-full border rounded px-3 py-2 text-sm"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={200}
              placeholder="พิมพ์คำอวยพรของคุณ..."
            />
            <div className="text-xs text-right mt-1">{message.length} / 200</div>
          </div>

          {/* ✅ Checkbox */}
          <label className="flex items-center gap-2 mb-6 text-sm">
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
            />
            ยืนยันว่าคำอวยพรของฉันเหมาะสมต่อการแสดงผล
          </label>

          {/* 🟦 Submit */}
          <button
            className="w-full bg-blue-600 text-white py-3 rounded-full text-sm font-semibold hover:bg-blue-700"
            disabled={!agree}
          >
            ต่อไป →
          </button>
        </div>
      </div>
    </div>
  );
}
