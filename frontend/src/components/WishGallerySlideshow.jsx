import React, { useState, useEffect } from "react";

// mock data: array ของ url รูป jpg
const mockImages = [
  "https://placehold.co/1920x1080?text=Wish+1",
  "https://placehold.co/1920x1080?text=Wish+2",
  "https://placehold.co/1920x1080?text=Wish+3",
  "https://placehold.co/1920x1080?text=Wish+4",
];

export default function WishGallerySlideshow() {
  const [current, setCurrent] = useState(0);

  // auto slide ทุก 3 วินาที
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % mockImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-screen h-screen fixed top-0 left-0 flex flex-col justify-center items-center bg-gradient-to-br from-yellow-100 to-blue-100 select-none overflow-hidden">
      <img
        src={mockImages[current]}
        alt={`wish ${current + 1}`}
        className="w-full h-full object-contain transition-all duration-500 absolute top-0 left-0 z-0"
        draggable={false}
      />
      {/* ตัวเลขหน้าปัจจุบัน */}
      <div className="absolute bottom-6 right-8 bg-black/60 text-white text-lg px-4 py-2 rounded-full z-10 shadow">
        {current + 1} / {mockImages.length}
      </div>
    </div>
  );
} 