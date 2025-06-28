import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import JSZip from "jszip";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://pbphoto-api-fae29207c672.herokuapp.com";

export default function WishGalleryList() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [downloadingAll, setDownloadingAll] = useState(false);

  useEffect(() => {
    if (eventId) {
      axios.get(`${BASE_URL}/api/wishes?eventId=${eventId}`)
        .then(res => setImages(res.data))
        .catch(() => setImages([]))
        .finally(() => setLoading(false));
    }
  }, [eventId]);

  const openModal = idx => {
    setCurrentIdx(idx);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const prevImg = () => setCurrentIdx(idx => (idx - 1 + images.length) % images.length);
  const nextImg = () => setCurrentIdx(idx => (idx + 1) % images.length);

  const downloadImg = () => {
    const url = images[currentIdx];
    const a = document.createElement("a");
    a.href = url;
    a.download = `wish-card-${currentIdx + 1}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAll = async () => {
    setDownloadingAll(true);
    const zip = new JSZip();
    const folder = zip.folder("wish-cards");
    let count = 0;
    for (let i = 0; i < images.length; i++) {
      try {
        const response = await fetch(images[i]);
        const blob = await response.blob();
        folder.file(`wish-card-${i + 1}.jpg`, blob);
        count++;
      } catch (e) {
        // skip failed
      }
    }
    if (count > 0) {
      const content = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(content);
      a.download = `wish-cards.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    setDownloadingAll(false);
  };

  if (loading) return <div className="text-center py-10">กำลังโหลด...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-yellow-50 font-prompt p-6">
      {/* ปุ่มย้อนกลับ */}
      <div className="max-w-5xl mx-auto mb-2 flex">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded shadow text-sm font-medium"
        >
          ← กลับ
        </button>
      </div>
      <h1 className="text-2xl font-bold text-center mb-6">แกลเลอรี่</h1>
      {images.length > 0 && (
        <div className="flex justify-end max-w-5xl mx-auto mb-4">
          <button
            onClick={downloadAll}
            disabled={downloadingAll}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow text-sm font-medium flex items-center gap-2"
          >
            {downloadingAll ? "กำลังดาวน์โหลด..." : "ดาวน์โหลดทั้งหมด"}
          </button>
        </div>
      )}
      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.length === 0 && (
          <div className="col-span-full text-center text-gray-400">ยังไม่มีคำอวยพร</div>
        )}
        {images.map((url, idx) => (
          <div
            key={idx}
            className="cursor-pointer flex flex-col items-center group"
            onClick={() => openModal(idx)}
          >
            <img
              src={url || "https://placehold.co/300x200?text=No+Image"}
              alt={`wish-card-${idx + 1}`}
              className="w-full aspect-square object-cover transition-transform duration-200 group-hover:scale-105"
              style={{ borderRadius: 0, boxShadow: 'none', background: 'none' }}
            />
            <div className="text-xs text-gray-500 mt-1">คลิกเพื่อดูรูป</div>
          </div>
        ))}
      </div>

      {/* Modal/Lightbox */}
      {modalOpen && images.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="relative max-w-2xl w-full flex flex-col items-center">
            <button
              className="absolute top-2 right-2 text-white text-2xl bg-black/70 hover:bg-black rounded-full w-10 h-10 flex items-center justify-center transition"
              onClick={closeModal}
              aria-label="ปิด"
            >×</button>
            <img
              src={images[currentIdx]}
              alt={`wish-card-large-${currentIdx + 1}`}
              className="max-h-[70vh] w-auto rounded shadow-lg"
            />
            <div className="flex gap-4 mt-4">
              <button
                onClick={prevImg}
                className="bg-white/80 hover:bg-white text-gray-700 px-4 py-2 rounded shadow"
              >← ก่อนหน้า</button>
              <button
                onClick={downloadImg}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
              >ดาวน์โหลด</button>
              <button
                onClick={nextImg}
                className="bg-white/80 hover:bg-white text-gray-700 px-4 py-2 rounded shadow"
              >ถัดไป →</button>
            </div>
            <div className="text-white mt-2 text-sm">
              {currentIdx + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 