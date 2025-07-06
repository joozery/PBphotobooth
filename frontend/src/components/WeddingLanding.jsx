import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgFlower from "../assets/bgflower.jpg";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://pbphoto-api-fae29207c672.herokuapp.com";

export default function WeddingLanding() {
  const navigate = useNavigate();
  const [cover, setCover] = useState("");
  const [event, setEvent] = useState(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/events`).then(res => {
      const latest = res.data && res.data.length > 0 ? res.data[0] : null;
      if (latest) {
        setCover(latest.cover_image);
        setEvent(latest);
      }
    });
  }, []);

  const eventId = event?.id || 1;

  return (
    <div className="w-screen h-screen font-prompt flex justify-center items-center bg-[#eee]">
      <div
        className="w-full max-w-xl h-[100svh] bg-cover bg-center bg-no-repeat flex flex-col justify-end px-6 py-10 shadow-xl rounded-none border border-white"
        style={{
          backgroundImage: `url(${cover || bgFlower})`,
        }}
      >
        <div className="flex flex-col justify-end h-full w-full px-4 py-6 rounded gap-4">
          <button
            className="w-full py-3 rounded-full flex items-center justify-center gap-2 font-medium shadow hover:opacity-90 transition-all bg-[#2d6a4f] text-white text-lg"
            onClick={() => navigate(`/wish-gallery-list/${eventId}`)}
          >
            <FaEye /> ดูคำอวยพร
          </button>
        </div>
      </div>
    </div>
  );
}
