// src/pages/EventDetail.jsx
import React, { useState, useEffect } from "react";
import { FaPenNib, FaReceipt, FaRegEye } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import bgFlower from "../assets/bgflower.jpg";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function EventDetail() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/events/${eventId}`);
        setEvent(res.data);
        console.log("🌈 Event Data:", res.data);
      } catch (err) {
        console.error("❌ ไม่พบข้อมูลงาน:", err);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (!event) return <div className="p-6">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="w-screen h-screen flex items-center justify-center font-prompt bg-[#eee]">
      <div
        className="w-full max-w-lg h-[100svh] relative bg-cover bg-center bg-no-repeat flex flex-col justify-end shadow-xl"
        style={{
          backgroundImage: `url(${event.cover_image || bgFlower})`,
        }}
      >
        {/* 🔘 Action Buttons */}
        <div className="w-full px-6 z-10 flex flex-col gap-3  pt-4 pb-6 ">
          {event.show_wish_button && (
            <button
              onClick={() => navigate("/wish")}
              className="w-full py-3 rounded-full shadow-lg flex items-center justify-center gap-2 text-sm font-semibold"
              style={{
                backgroundColor: event.wish_button_bg || "#1d4ed8",
                color: event.wish_button_text_color || "#ffffff",
              }}
            >
              <FaPenNib className="text-base" />
              {event.wish_button_text || "เริ่มเขียนคำอวยพร"}
            </button>
          )}

          {event.show_slip_button && (
            <button
              onClick={() => navigate("/slip")}
              className="w-full py-3 rounded-full shadow flex items-center justify-center gap-2 text-sm font-medium border"
              style={{
                backgroundColor: event.slip_button_bg || "#ffffff",
                color: event.slip_button_text_color || "#1d4ed8",
              }}
            >
              <FaReceipt className="text-base" />
              {event.slip_button_text || "แนบสลิปพร้อมเพย์"}
            </button>
          )}

          {event.show_view_wishes_button && (
            <button
              onClick={() => navigate("/wishes")}
              className="w-full py-3 rounded-full shadow flex items-center justify-center gap-2 text-sm font-medium border"
              style={{
                backgroundColor: event.view_wishes_button_bg || "#f97316",
                color: event.view_wishes_button_text_color || "#ffffff",
              }}
            >
              <FaRegEye className="text-base" />
              {event.view_wishes_button_text || "ดูคำอวยพร"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}