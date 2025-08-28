import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaPlus,
  FaExternalLinkAlt,
  FaEdit,
  FaTrash,
  FaDownload,
  FaRegEye,
} from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://72-60-43-104.sslip.io";

function ManageEvents({ onSelectPage }) {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/events`);
      setEvents(res.data || []);
    } catch (error) {
      toast.error("❌ โหลดข้อมูลไม่สำเร็จ");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("คุณแน่ใจว่าต้องการลบงานนี้?")) {
      try {
        await axios.delete(`${BASE_URL}/api/events/${id}`);
        toast.success("✅ ลบงานเรียบร้อยแล้ว");
        fetchEvents();
      } catch (error) {
        toast.error("❌ ลบงานไม่สำเร็จ");
        console.error(error);
      }
    }
  };

  const handleDownloadQR = (link, title) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}`;
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = `qr_${title}.png`;
    a.click();
    toast.success("✅ ดาวน์โหลด QR สำเร็จ");
  };

  return (
    <div className="p-4 md:p-6 font-prompt">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">จัดการงานอีเว้นต์</h1>
        <button
          onClick={() => onSelectPage('create-event')}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          <FaPlus size={14} />
          สร้างงานใหม่
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-2 py-3">ลำดับ</th>
              <th className="px-2 py-3">ชื่องาน</th>
              <th className="px-2 py-3">วันที่จัดงาน</th>
              <th className="px-2 py-3">ลิงก์งาน</th>
              <th className="px-2 py-3">QR Code</th>
              <th className="px-2 py-3">ดูสไลด์การ์ด</th>
              <th className="px-2 py-3">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {events.map((event, index) => {
              const localLink = `/event/${event.id}`;
              const qrLink = `${window.location.origin}/event/${event.id}`;
              const viewWishLink = `/wishes?eventId=${event.id}`;

              return (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-2 py-3">{index + 1}</td>
                  <td className="px-2 py-3 text-purple-700 font-medium">{event.title}</td>
                  <td className="px-2 py-3 text-gray-600">
                    {event.event_date
                      ? new Date(event.event_date).toLocaleDateString('th-TH', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })
                      : '-'}
                  </td>
                  <td className="px-2 py-3">
                    <Link
                      to={localLink}
                      className="text-blue-600 hover:underline flex items-center justify-center gap-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaExternalLinkAlt size={12} /> ไปยังลิงก์
                    </Link>
                  </td>
                  <td className="px-2 py-3">
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(qrLink)}`}
                        alt="QR Code"
                        className="w-24 h-24 border rounded"
                      />
                      <button
                        onClick={() => handleDownloadQR(qrLink, event.title)}
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <FaDownload size={12} /> ดาวน์โหลด
                      </button>
                    </div>
                  </td>
                  <td className="px-2 py-3">
                    <Link
                      to={`/slideshow/${event.id}`}
                      className="text-orange-600 hover:underline flex items-center justify-center gap-1 text-sm"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaRegEye size={12} />
                      ดูสไลด์การ์ด
                    </Link>
                  </td>
                  <td className="px-2 py-3 flex justify-center gap-2 flex-wrap">
                    <Link
                      to={`/event/${event.id}/edit`}
                      className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                      title="แก้ไข"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      title="ลบ"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageEvents;