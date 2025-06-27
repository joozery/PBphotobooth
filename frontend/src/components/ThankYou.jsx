import React, { useEffect, useState } from "react";
import { FaImage, FaQrcode } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://pbphoto-api-fae29207c672.herokuapp.com";

export default function ThankYou() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [cover, setCover] = useState("");

  useEffect(() => {
    if (eventId) {
      axios.get(`${BASE_URL}/api/events/${eventId}`)
        .then((res) => {
          setCover(res.data.cover_image);
        })
        .catch((err) => {
          console.error("❌ โหลด cover_image ไม่สำเร็จ:", err);
        });
    }
  }, [eventId]);

  return (
    <div className="w-screen h-screen font-prompt flex justify-center items-center bg-[#eee]">
      <div
        className="w-full max-w-xl h-[100svh] bg-cover bg-center bg-no-repeat flex flex-col justify-between px-6 py-10 shadow-xl rounded-none border border-white"
        style={{
          backgroundImage: `url(${cover || "/default-bg.jpg"})`,
        }}
      >
        <div className="flex flex-col justify-between h-full w-full  px-4 py-6 rounded">
          {/* 💌 Heading */}
          <div className="text-center">
          </div>

          {/* 🎁 Action Buttons */}
          <div className="flex flex-col gap-3 mt-10">
            <button
              className="w-full bg-white border border-blue-500 py-2 rounded-full flex items-center justify-center gap-2 text-blue-700 font-medium shadow hover:bg-blue-50 transition-all"
              onClick={() => navigate("/wish-gallery")}
            >
              <FaImage /> ดูรูปคำอวยพร
            </button>
            <button className="w-full bg-white border border-blue-500 py-2 rounded-full flex items-center justify-center gap-2 text-blue-700 font-medium shadow hover:bg-blue-50 transition-all">
              <FaQrcode /> แนบสลิปพร้อมเพย์
            </button>
          </div>

          {/* ⬅️ Return */}
          <div className="mt-10">
            <button
              onClick={() => navigate(`/event/${eventId}`)}
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