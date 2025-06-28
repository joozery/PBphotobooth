import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FolderDetailDialog from "./FolderDetailDialog";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://pbphoto-api-fae29207c672.herokuapp.com";

export default function WishGallery() {
  const { eventId } = useParams();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishCards, setWishCards] = useState([]);

  // โหลด event ทั้งหมด
  useEffect(() => {
    if (!eventId) {
      axios.get(`${BASE_URL}/api/events`).then(res => {
        setEvents(res.data || []);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [eventId]);

  // โหลด event เดียวและ wish card ถ้ามี eventId
  useEffect(() => {
    if (eventId) {
      setLoading(true);
      Promise.all([
        axios.get(`${BASE_URL}/api/events/${eventId}`),
        axios.get(`${BASE_URL}/api/wishes?eventId=${eventId}`)
      ]).then(([eventRes, wishesRes]) => {
        setSelectedFolder({
          ...eventRes.data,
          name: eventRes.data.title,
          subtitle: eventRes.data.subtitle || '',
          event: eventRes.data.title,
          itemsCount: wishesRes.data.length,
        });
        setWishCards(wishesRes.data.map((url, i) => ({ url, index: i + 1 })));
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [eventId]);

  // กรณี /wish-gallery/:eventId
  if (eventId && selectedFolder) {
    return (
      <div className="font-prompt min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50 p-6">
        <FolderDetailDialog
          isOpen={true}
          onOpenChange={() => {}}
          folder={selectedFolder}
          wishCards={wishCards}
          onImageClick={() => {}}
        />
      </div>
    );
  }

  // กรณี /wish-gallery (ไม่มี eventId)
  return (
    <div className="font-prompt min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-pink-700 text-center mb-10">
          รายการงานและจำนวนรูป card อวยพรทั้งหมด
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
                  {event.wish_count || 0} การ์ดอวยพร
                </div>
              </div>
              <div className="p-5">
                <h2 className="text-xl font-semibold text-pink-700 mb-1">
                  {event.title}
                </h2>
                <button
                  className="mt-3 bg-pink-500 hover:bg-pink-600 text-white text-sm px-4 py-2 rounded-full shadow"
                  onClick={async () => {
                    setLoading(true);
                    const wishesRes = await axios.get(`${BASE_URL}/api/wishes?eventId=${event.id}`);
                    setSelectedFolder({
                      ...event,
                      name: event.title,
                      subtitle: event.subtitle || '',
                      event: event.title,
                      itemsCount: wishesRes.data.length,
                    });
                    setWishCards(wishesRes.data.map((url, i) => ({ url, index: i + 1 })));
                    setOpenDialog(true);
                    setLoading(false);
                  }}
                >
                  ดูรูป card อวยพรทั้งหมด
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
      {/* Dialog แสดงอัลบั้ม */}
      <FolderDetailDialog
        isOpen={openDialog}
        onOpenChange={setOpenDialog}
        folder={selectedFolder}
        wishCards={wishCards}
        onImageClick={(imgUrl, allImgs, index) =>
          console.log("Clicked:", imgUrl)
        }
      />
    </div>
  );
}
