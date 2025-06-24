import React from "react";

export default function WishGalleryListMockup() {
  const events = [
    {
      id: 1,
      title: "งานแต่งโจ้ & จูน",
      cover_image: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      wish_count: 12,
    },
    {
      id: 2,
      title: "งานหมั้นบี & เบิร์ด",
      cover_image: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      wish_count: 8,
    },
    {
      id: 3,
      title: "งานแต่งมิว & นัท",
      cover_image: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      wish_count: 15,
    },
  ];

  return (
    <div className="font-prompt min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-pink-700 text-center mb-10">
          รายการงานและจำนวนคำอวยพร
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
            >
              <div className="relative">
                <img
                  src={event.cover_image}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-t-3xl"
                />
                <div className="absolute top-2 right-2 bg-pink-600 text-white text-xs px-2 py-0.5 rounded-full shadow">
                  {event.wish_count} ภาพอวยพร
                </div>
              </div>
              <div className="p-5">
                <h2 className="text-xl font-semibold text-pink-700 mb-1">
                  {event.title}
                </h2>
                <button
                  className="mt-3 bg-pink-500 hover:bg-pink-600 text-white text-sm px-4 py-2 rounded-full shadow"
                  onClick={() => alert(`ไปยังงาน ID: ${event.id}`)}
                >
                  ดูคำอวยพรทั้งหมด
                </button>
              </div>
            </div>
          ))}

          {events.length === 0 && (
            <p className="col-span-full text-center text-gray-400">
              ยังไม่มีงานที่สร้าง
            </p>
          )}
        </div>
      </div>
    </div>
  );
}