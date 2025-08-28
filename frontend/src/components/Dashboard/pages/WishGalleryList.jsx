import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://72-60-43-104.sslip.io";

export default function WishGalleryList() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${BASE_URL}/api/events`).then((res) => {
      setEvents(res.data);
    }).catch((err) => {
      console.error("โหลด events ไม่สำเร็จ", err);
    });
  }, []);

  return (
    <div className="font-prompt p-6 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">📋 รายการงานทั้งหมด</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events.map(event => (
          <div
            key={event.id}
            className="cursor-pointer bg-white rounded-xl shadow hover:shadow-lg overflow-hidden"
            onClick={() => navigate(`/wish-gallery/${event.id}`)}
          >
            <img
              src={event.cover_image}
              alt={event.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <p className="col-span-full text-center text-gray-400">ยังไม่มีงานในระบบ</p>
        )}
      </div>
    </div>
  );
}