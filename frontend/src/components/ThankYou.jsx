import React, { useEffect, useState } from "react";
import { FaImage, FaQrcode } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://pbphoto-api-fae29207c672.herokuapp.com";

export default function ThankYou() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [cover, setCover] = useState("");
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (eventId) {
      axios.get(`${BASE_URL}/api/events/${eventId}`)
        .then((res) => {
          setCover(res.data.cover_image);
          setEvent(res.data);
        })
        .catch((err) => {
          console.error("❌ โหลด cover_image ไม่สำเร็จ:", err);
        });
    }
  }, [eventId]);

  // ปุ่มจาก event setting หรือ default
  const wishButtonText = event?.wish_button_text || "เริ่มเขียนคำอวยพร";
  const wishButtonBg = event?.wish_button_bg || "#1d4ed8";
  const wishButtonTextColor = event?.wish_button_text_color || "#ffffff";

  const slipButtonText = event?.slip_button_text || "แนบสลิปพร้อมเพย์";
  const slipButtonBg = event?.slip_button_bg || "#ffffff";
  const slipButtonTextColor = event?.slip_button_text_color || "#1d4ed8";

  const viewWishesButtonText = event?.view_wishes_button_text || "ดูรูป card อวยพรทั้งหมด";
  const viewWishesButtonBg = event?.view_wishes_button_bg || "#f97316";
  const viewWishesButtonTextColor = event?.view_wishes_button_text_color || "#ffffff";

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
              className="w-full py-2 rounded-full flex items-center justify-center gap-2 font-medium shadow hover:opacity-90 transition-all"
              style={{ backgroundColor: viewWishesButtonBg, color: viewWishesButtonTextColor }}
              onClick={() => navigate(`/wish-gallery-list/${eventId}`)}
            >
              <FaImage /> {viewWishesButtonText}
            </button>
            <button
              onClick={() => navigate(`/upload-slip/${eventId}`)}
              className="flex-1 py-2 rounded-full font-semibold shadow hover:opacity-90 transition"
              style={{ backgroundColor: slipButtonBg, color: slipButtonTextColor }}
            >
              {slipButtonText}
            </button>
          </div>

          {/* ⬅️ Return */}
          <div className="mt-10">
            <button
              onClick={() => navigate(`/event/${eventId}`)}
              className="w-full py-3 rounded-full font-semibold shadow-lg hover:opacity-90 transition"
              style={{ backgroundColor: wishButtonBg, color: wishButtonTextColor }}
            >
              กลับหน้าแรก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}