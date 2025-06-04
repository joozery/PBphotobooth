import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaExternalLinkAlt } from 'react-icons/fa';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://pbphoto-api-fae29207c672.herokuapp.com";

function ManageEvents({ onSelectPage }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/events`);
        setEvents(res.data || []);
      } catch (error) {
        console.error("❌ ดึงข้อมูล events ล้มเหลว:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">จัดการงานอีเว้นต์</h1>
        <button
          onClick={() => onSelectPage('create-event')}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          <FaPlus size={14} />
          สร้างงานใหม่
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-600">ลำดับ</th>
              <th className="px-4 py-3 font-medium text-gray-600">ชื่องาน</th>
              <th className="px-4 py-3 font-medium text-gray-600">วันที่จัดงาน</th>
              <th className="px-4 py-3 font-medium text-gray-600">ลิงก์งาน</th>
              <th className="px-4 py-3 font-medium text-gray-600">QR Code</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {events.map((event, index) => {
              const localLink = `/event/${event.id}`; // สำหรับ <Link>
              const qrLink = `${window.location.origin}/event/${event.id}`; // สำหรับ QR
              return (
                <tr key={event.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 text-purple-700 font-medium">{event.title}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {event.event_date
                      ? new Date(event.event_date).toLocaleDateString('th-TH', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })
                      : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={localLink}
                      className="text-blue-600 hover:underline flex items-center justify-center gap-1"
                    >
                      <FaExternalLinkAlt size={12} />
                      ไปยังลิงก์
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(qrLink)}`}
                      alt="QR Code"
                      className="w-20 h-20 mx-auto border rounded"
                    />
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
