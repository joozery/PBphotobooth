import React from "react";

export default function WishGalleryMockup() {
  const event = {
    id: 1,
    title: "งานแต่งโจ้ & จูน",
    cover_image: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
  };

  const wishes = [
    {
      id: 1,
      name: "คุณเอ",
      message: "ขอให้มีความสุขมาก ๆ 🎉",
      image: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    },
    {
      id: 2,
      name: "คุณบี",
      message: "รักกันตลอดไปนะคะ 💕",
      image: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    },
    {
      id: 3,
      name: "คุณซี",
      message: "ยินดีด้วยนะครับ 🎊 ขอให้มีลูกไว ๆ 👶",
      image: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    },
  ];

  return (
    <div className="font-prompt p-6 min-h-screen bg-gray-50">
      {/* Event header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{event.title}</h2>
        {event.cover_image && (
          <img
            src={event.cover_image}
            alt={event.title}
            className="mx-auto w-full max-w-md h-auto rounded-lg shadow-lg"
          />
        )}
      </div>

      {/* Wishes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishes.map((wish) => (
          <div
            key={wish.id}
            className="bg-white shadow-md rounded-2xl overflow-hidden transition hover:shadow-xl"
          >
            <img
              src={wish.image || "/sample-image.png"}
              alt={`คำอวยพรจาก ${wish.name}`}
              className="w-full h-56 object-cover"
            />
            <div className="p-4">
              <h4 className="text-lg font-semibold text-pink-600 mb-1">
                💌 {wish.name}
              </h4>
              <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                {wish.message}
              </p>
            </div>
          </div>
        ))}

        {wishes.length === 0 && (
          <p className="col-span-full text-center text-gray-400">
            ยังไม่มีคำอวยพรในงานนี้
          </p>
        )}
      </div>
    </div>
  );
}