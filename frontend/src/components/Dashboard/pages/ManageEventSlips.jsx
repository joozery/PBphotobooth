import React, { useEffect, useState } from "react";
import {
  FaFemale,
  FaMale,
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaInfoCircle
} from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function ManageEventSlips() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const mockEvents = [
      {
        event_id: 1,
        event_name: "งานแต่ง เจน & ต้น",
        total_bride: 15000,
        total_groom: 20000,
        total_slips: 10
      },
      {
        event_id: 2,
        event_name: "งานหมั้น มิ้น & บอส",
        total_bride: 12000,
        total_groom: 18000,
        total_slips: 8
      },
      {
        event_id: 3,
        event_name: "พิธีสมรส แพรว & นัท",
        total_bride: 25000,
        total_groom: 30000,
        total_slips: 15
      }
    ];
    setEvents(mockEvents);
  }, []);

  const mockSlipDetails = {
    1: [
      { name: "คุณเอ", amount: 5000, side: "เจ้าสาว" },
      { name: "คุณบี", amount: 10000, side: "เจ้าบ่าว" }
    ],
    2: [
      { name: "คุณซี", amount: 7000, side: "เจ้าสาว" },
      { name: "คุณดี", amount: 8000, side: "เจ้าบ่าว" }
    ],
    3: [
      { name: "คุณอี", amount: 15000, side: "เจ้าสาว" },
      { name: "คุณเอฟ", amount: 20000, side: "เจ้าบ่าว" }
    ]
  };

  const exportToExcel = (eventId, eventName) => {
    const details = mockSlipDetails[eventId] || [];

    const data = details.map((d) => ({
      "ชื่อผู้โอน": d.name,
      "ยอดโอน (บาท)": d.amount,
      ฝั่ง: d.side
    }));

    const ws = XLSX.utils.json_to_sheet(data);

    // เพิ่ม summary row
    const total = details.reduce((sum, d) => sum + d.amount, 0);
    XLSX.utils.sheet_add_aoa(ws, [["รวมทั้งหมด", total, "บาท"]], {
      origin: -1
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Slip Summary");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      `Slip_Summary_${eventName}.xlsx`
    );
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
                    className="text-sm text-white bg-green-500 px-3 py-1.5 rounded hover:bg-green-600"
                    onClick={() => exportToExcel(ev.event_id, ev.event_name)}
                  >
                    ดาวน์โหลด Excel
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
