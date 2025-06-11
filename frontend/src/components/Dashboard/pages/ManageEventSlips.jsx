import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaFemale,
  FaMale,
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaInfoCircle,
} from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export default function ManageEventSlips() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEventSlipSummary();
  }, []);

  const fetchEventSlipSummary = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/events/slip-summary`);
      setEvents(res.data || []);
    } catch (err) {
      console.error("❌ โหลดข้อมูลสรุปสลิปล้มเหลว:", err);
    }
  };

  return (
    <div className="p-6 font-prompt">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FaMoneyBillWave className="text-green-600" /> สรุปยอดใส่ซองแต่ละงานอีเวนต์
      </h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">ชื่องาน</th>
              <th className="p-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  <FaFemale className="text-pink-500" /> เจ้าสาว
                </div>
              </th>
              <th className="p-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  <FaMale className="text-blue-500" /> เจ้าบ่าว
                </div>
              </th>
              <th className="p-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  <FaMoneyBillWave /> รวมทั้งหมด
                </div>
              </th>
              <th className="p-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  <FaFileInvoiceDollar /> รายการ
                </div>
              </th>
              <th className="p-3 text-center">
                <div className="flex items-center justify-center gap-1">
                  <FaInfoCircle /> รายละเอียด
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev.event_id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{ev.event_name}</td>
                <td className="p-3 text-center text-pink-600 font-semibold">
                  {ev.total_bride.toLocaleString()} บาท
                </td>
                <td className="p-3 text-center text-blue-600 font-semibold">
                  {ev.total_groom.toLocaleString()} บาท
                </td>
                <td className="p-3 text-center font-bold">
                  {(ev.total_bride + ev.total_groom).toLocaleString()} บาท
                </td>
                <td className="p-3 text-center">{ev.total_slips} รายการ</td>
                <td className="p-3 text-center">
                  <button
                    className="text-sm text-white bg-purple-500 px-3 py-1.5 rounded hover:bg-purple-600"
                    onClick={() =>
                      window.open(`/admin/view-event-slips/${ev.event_id}`, "_blank")
                    }
                  >
                    รายละเอียด
                  </button>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-gray-400 py-6">
                  ไม่มีข้อมูลการใส่ซองในระบบ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}