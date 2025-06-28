import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://pbphoto-api-fae29207c672.herokuapp.com";

export default function WishGallerySlideshow() {
  const { eventId } = useParams();
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eventId) {
      axios.get(`${BASE_URL}/api/wishes?eventId=${eventId}`)
        .then(res => {
          setImages(res.data || []);
          setLoading(false);
        })
        .catch(() => {
          setImages([]);
          setLoading(false);
        });
    }
  }, [eventId]);

  // auto slide ทุก 3 วินาที
  useEffect(() => {
    if (images.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images.length]);

  if (loading) {
    return (
      <div className="w-screen h-screen fixed top-0 left-0 flex flex-col justify-center items-center bg-gradient-to-br from-yellow-100 to-blue-100">
        <div className="text-2xl">กำลังโหลด...</div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="w-screen h-screen fixed top-0 left-0 flex flex-col justify-center items-center bg-gradient-to-br from-yellow-100 to-blue-100">
        <div className="text-2xl text-gray-500">ยังไม่มีคำอวยพร</div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen fixed top-0 left-0 flex flex-col justify-center items-center bg-gradient-to-br from-yellow-100 to-blue-100 select-none overflow-hidden">
      <img
        src={images[current]}
        alt={`wish ${current + 1}`}
        className="w-full h-full object-contain transition-all duration-500 absolute top-0 left-0 z-0"
        draggable={false}
      />
      {/* ตัวเลขหน้าปัจจุบัน */}
      <div className="absolute bottom-6 right-8 bg-black/60 text-white text-lg px-4 py-2 rounded-full z-10 shadow">
        {current + 1} / {images.length}
      </div>
    </div>
  );
} 