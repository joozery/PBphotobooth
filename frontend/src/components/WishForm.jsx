import React, { useState } from "react";
import { FaUserTie, FaUser, FaRegSmile } from "react-icons/fa";

export default function WishForm() {
  const [side, setSide] = useState("groom");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(true);
  const [preview, setPreview] = useState("/sample-image.png");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const sideOptions = [
    {
      label: "ฝ่ายเจ้าบ่าว",
      icon: <FaUserTie />,
      value: "groom",
      activeClass: "border-blue-500 bg-blue-50 scale-105 shadow",
      iconColor: "text-blue-500",
    },
    {
      label: "ฝ่ายเจ้าสาว",
      icon: <FaUser />,
      value: "bride",
      activeClass: "border-pink-500 bg-pink-50 scale-105 shadow",
      iconColor: "text-pink-500",
    },
  ];

  return (
    <div className="w-screen h-[100svh] bg-gradient-to-br from-yellow-50 to-white flex justify-center items-center font-prompt transition-all overflow-hidden">
      <div className="w-full max-w-sm h-[95svh] bg-white shadow-xl border border-gray-200 rounded-xl p-5">
        {/* Heading */}
        <div className="text-center mb-4">
          <FaRegSmile className="text-3xl text-yellow-500 mx-auto mb-2 animate-bounce" />
          <h1 className="text-xl font-semibold text-gray-700">ร่วมส่งคำอวยพร</h1>
          <p className="text-sm text-gray-500">เพื่อความประทับใจในวันพิเศษ</p>
        </div>

        {/* Image Upload */}
        <div className="rounded-lg p-4 border border-dashed mb-4 hover:shadow-inner transition-all">
          <p className="text-sm text-center mb-2 text-gray-500">
            📷 *แนะนำเลือกรูปตั้งตรง (300x300px)
          </p>
          <div className="flex justify-center">
            <img
              src={preview}
              alt="Uploaded"
              className="w-32 h-32 rounded-lg object-cover border border-gray-300 shadow"
            />
          </div>
          <div className="mt-3 flex justify-center">
            <label className="bg-gray-100 hover:bg-gray-200 text-sm px-4 py-1 rounded-full shadow-inner cursor-pointer transition">
              เปลี่ยนรูป
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Select Side */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {sideOptions.map(({ label, icon, value, activeClass, iconColor }) => {
            const isActive = side === value;
            return (
              <button
                key={value}
                onClick={() => setSide(value)}
                className={`flex flex-col items-center p-3 rounded-xl border transition-all duration-200 ${
                  isActive
                    ? activeClass
                    : "border-gray-300 bg-white hover:bg-gray-50"
                }`}
              >
                <div
                  className={`text-2xl mb-1 ${
                    isActive ? iconColor : "text-gray-400"
                  }`}
                >
                  {icon}
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">ชื่อ</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            placeholder="ใส่ชื่อของคุณ"
          />
          <div className="text-xs text-right mt-1 text-gray-400">{name.length} / 20</div>
        </div>

        {/* Message Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">คำอวยพร</label>
          <textarea
            rows={3}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={200}
            placeholder="พิมพ์คำอวยพรของคุณ..."
          />
          <div className="text-xs text-right mt-1 text-gray-400">{message.length} / 200</div>
        </div>

        {/* Agreement */}
        <label className="flex items-center gap-2 mb-5 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={agree}
            onChange={() => setAgree(!agree)}
            className="accent-yellow-400"
          />
          ยืนยันว่าคำอวยพรของฉันเหมาะสมต่อการแสดงผล
        </label>

        {/* Submit */}
        <button
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
  );
}