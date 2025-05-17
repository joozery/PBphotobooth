import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaExternalLinkAlt } from 'react-icons/fa';

const dummyEvents = [
  {
    id: 'event001',
    name: 'พิธีแต่งงานคุณนัท & คุณเจน',
    date: '12 พฤษภาคม 2025',
  },
  {
    id: 'event002',
    name: 'พิธีแต่งงานคุณฟ้า & คุณมิกซ์',
    date: '20 พฤษภาคม 2025',
  },
  {
    id: 'event003',
    name: 'พิธีแต่งงานคุณตาล & คุณต้น',
    date: '28 พฤษภาคม 2025',
  },
];

function ManageEvents({ onSelectPage }) {
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
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-6 py-3 font-medium text-gray-600">ลำดับ</th>
              <th className="px-6 py-3 font-medium text-gray-600">ชื่องาน</th>
              <th className="px-6 py-3 font-medium text-gray-600">วันที่จัดงาน</th>
              <th className="px-6 py-3 font-medium text-gray-600">การจัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {dummyEvents.map((event, index) => (
              <tr key={event.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                <td className="px-6 py-4 text-purple-700 font-medium">{event.name}</td>
                <td className="px-6 py-4 text-gray-600">{event.date}</td>
                <td className="px-6 py-4">
                  <Link
                    to={`/event/${event.id}`}
                    className="flex items-center text-sm text-blue-600 hover:underline"
                  >
                    <FaExternalLinkAlt className="mr-1" size={12} />
                    ดูงาน
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageEvents;
