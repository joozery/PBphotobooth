import React from "react";
import { FaImage, FaQrcode } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import bgFlower from "../assets/bgflower.jpg";

export default function ThankYou() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen font-prompt flex justify-center items-center bg-[#eee]">
      <div
        className="w-full max-w-xl h-[100svh] bg-cover bg-center bg-no-repeat flex flex-col justify-between px-6 py-10 shadow-xl rounded-none border border-white"
        style={{ backgroundImage: `url(${bgFlower})` }}
      >
        {/* ✅ เพิ่มพื้นหลังโปร่งทับเพื่ออ่านง่าย */}
        <div className="flex flex-col justify-between h-full w-full  backdrop-blur-sm px-4 py-6 rounded">
          {/* 💌 Heading */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#4d3b30] tracking-widest mb-1">
              THANK YOU
            </h1>
            <p className="text-sm text-gray-700">FOR JOINING US!</p>
          </div>

          {/* 🎁 Action Buttons */}
          <div className="flex flex-col gap-3 mt-10">
            <button className="w-full bg-white border border-blue-500 py-2 rounded-full flex items-center justify-center gap-2 text-blue-700 font-medium shadow hover:bg-blue-50 transition-all">
              <FaImage /> ดูรูปคำอวยพร
            </button>
            <button className="w-full bg-white border border-blue-500 py-2 rounded-full flex items-center justify-center gap-2 text-blue-700 font-medium shadow hover:bg-blue-50 transition-all">
              <FaQrcode /> แนบสลิปพร้อมเพย์
            </button>
          </div>

          {/* ⬅️ Return */}
          <div className="mt-10">
            <button
              onClick={() => navigate("/")}
              className="w-full bg-blue-700 text-white py-3 rounded-full font-semibold shadow-lg hover:bg-blue-800 transition"
            >
              กลับหน้าแรก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
