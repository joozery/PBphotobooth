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
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://pbphoto-api-fae29207c672.herokuapp.com";

export default function ManageEventSlips() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slipDetails, setSlipDetails] = useState({});

  // ดึงข้อมูลสรุปยอด slip ทั้งหมด
  const fetchSlipSummary = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/slips/summary`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching slip summary:', error);
      toast.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  // ดึงรายละเอียด slip ของแต่ละ event
  const fetchSlipDetails = async (eventId) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/slips/event/${eventId}`);
      setSlipDetails(prev => ({
        ...prev,
        [eventId]: response.data
      }));
    } catch (error) {
      console.error('Error fetching slip details:', error);
      toast.error('ไม่สามารถโหลดรายละเอียดได้');
    }
  };

  useEffect(() => {
    fetchSlipSummary();
  }, []);

  const exportToExcel = async (eventId, eventName) => {
    try {
      // ถ้ายังไม่มีข้อมูลรายละเอียด ให้ดึงมา
      if (!slipDetails[eventId]) {
        await fetchSlipDetails(eventId);
        // รอให้ state อัพเดท
        setTimeout(() => {
          exportToExcel(eventId, eventName);
        }, 500);
        return;
      }

      const details = slipDetails[eventId] || [];

      const data = details.map((d) => ({
        "ชื่อผู้โอน": d.name,
        "ยอดโอน (บาท)": d.amount,
        "ฝั่ง": d.side === 'bride' ? 'เจ้าสาว' : 'เจ้าบ่าว',
        "วันที่": new Date(d.created_at).toLocaleDateString('th-TH')
      }));

      const ws = XLSX.utils.json_to_sheet(data);

      // เพิ่ม summary row
      const total = details.reduce((sum, d) => sum + d.amount, 0);
      const totalBride = details.filter(d => d.side === 'bride').reduce((sum, d) => sum + d.amount, 0);
      const totalGroom = details.filter(d => d.side === 'groom').reduce((sum, d) => sum + d.amount, 0);
      
      XLSX.utils.sheet_add_aoa(ws, [
        ["", "", "", ""],
        ["สรุปยอด", "", "", ""],
        ["เจ้าสาว", totalBride, "บาท", ""],
        ["เจ้าบ่าว", totalGroom, "บาท", ""],
        ["รวมทั้งหมด", total, "บาท", ""]
      ], {
        origin: -1
      });

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Slip Summary");

      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        `Slip_Summary_${eventName}_${new Date().toISOString().split('T')[0]}.xlsx`
      );

      toast.success('ดาวน์โหลด Excel สำเร็จ');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('ไม่สามารถดาวน์โหลด Excel ได้');
    }
  };

  if (loading) {
    return (
      <div className="p-6 font-prompt">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">กำลังโหลดข้อมูล...</div>
        </div>
      </div>
    );
  }

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
                  {ev.total_bride ? ev.total_bride.toLocaleString() : '0'} บาท
                </td>
                <td className="p-3 text-center text-blue-600 font-semibold">
                  {ev.total_groom ? ev.total_groom.toLocaleString() : '0'} บาท
                </td>
                <td className="p-3 text-center font-bold">
                  {ev.total_amount ? ev.total_amount.toLocaleString() : '0'} บาท
                </td>
                <td className="p-3 text-center">{ev.total_slips || 0} รายการ</td>
                <td className="p-3 text-center">
                  <button
                    className="text-sm text-white bg-green-500 px-3 py-1.5 rounded hover:bg-green-600 transition"
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
