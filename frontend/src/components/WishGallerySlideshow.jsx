import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://pbphoto-api-fae29207c672.herokuapp.com";

export default function WishGallerySlideshow() {
  const { eventId } = useParams();
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  // ฟังก์ชันดึงข้อมูลจาก API
  const fetchImages = async () => {
    if (!eventId) return;
    
    try {
      const res = await axios.get(`${BASE_URL}/api/wishes?eventId=${eventId}`);
      console.log("🔄 Slideshow data refreshed:", res.data?.length || 0, "images");
      
      const newImages = res.data || [];
      setImages(newImages);
      
      // ถ้ามีรูปใหม่และ current index เกินจำนวนรูป ให้รีเซ็ต
      if (newImages.length > 0 && current >= newImages.length) {
        setCurrent(0);
      }
    } catch (err) {
      console.error("❌ Slideshow fetch error:", err);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  // โหลดครั้งแรก
  useEffect(() => {
    fetchImages();
  }, [eventId]);

  // Auto-refresh ทุก 30 วินาที
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      fetchImages();
    }, 30000); // 30 วินาที

    return () => clearInterval(refreshInterval);
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
        <div className="text-2xl text-gray-500 mb-4">ยังไม่มีคำอวยพรที่แสดงได้</div>
        <div className="text-sm text-gray-400">รอสักครู่ ระบบจะอัพเดทอัตโนมัติ...</div>
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
        onError={(e) => {
          console.error("❌ Image load error:", images[current]);
          e.target.style.display = 'none';
        }}
      />
      {/* ตัวเลขหน้าปัจจุบัน */}
      <div className="absolute bottom-6 right-8 bg-black/60 text-white text-lg px-4 py-2 rounded-full z-10 shadow">
        {current + 1} / {images.length}
      </div>
      {/* แสดงสถานะ auto-refresh */}
      <div className="absolute top-6 right-8 bg-green-600/80 text-white text-sm px-3 py-1 rounded-full z-10 shadow">
        🔄 Auto-refresh
      </div>
    </div>
  );
} 