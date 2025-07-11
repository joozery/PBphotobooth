// components/Dashboard/pages/DashboardOverview.jsx
import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaEnvelopeOpenText, FaUserShield, FaMoneyBillWave, FaCog } from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://pbphoto-api-fae29207c672.herokuapp.com";

function DashboardOverview() {
  const [eventCount, setEventCount] = useState(0);
  const [wishCount, setWishCount] = useState(0);
  const [slipSummary, setSlipSummary] = useState({ total: 0, total_bride: 0, total_groom: 0, total_slips: 0 });
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch events
        const eventsRes = await axios.get(`${BASE_URL}/api/events`);
        const events = eventsRes.data || [];
        setEventCount(events.length);

        // Monthly event chart
        const monthMap = {};
        events.forEach(ev => {
          if (ev.event_date) {
            const d = new Date(ev.event_date);
            const m = d.getMonth();
            monthMap[m] = (monthMap[m] || 0) + 1;
          }
        });
        const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
        const chartData = monthNames.map((name, i) => ({ month: name, events: monthMap[i] || 0 }));
        setMonthlyData(chartData);

        // Fetch wishes (รวมทุก event)
        let wishSum = 0;
        if (Array.isArray(events)) {
          wishSum = events.reduce((sum, ev) => sum + (ev.wish_count || 0), 0);
        }
        setWishCount(wishSum);

        // Fetch slip summary
        const slipRes = await axios.get(`${BASE_URL}/api/slips/summary`);
        const slipEvents = slipRes.data || [];
        let total = 0, total_bride = 0, total_groom = 0, total_slips = 0;
        slipEvents.forEach(ev => {
          total += parseFloat(ev.total_amount) || 0;
          total_bride += parseFloat(ev.total_bride) || 0;
          total_groom += parseFloat(ev.total_groom) || 0;
          total_slips += parseInt(ev.total_slips) || 0;
        });
        setSlipSummary({ total, total_bride, total_groom, total_slips });
      } catch (err) {
        // fallback
        setEventCount(0);
        setWishCount(0);
        setSlipSummary({ total: 0, total_bride: 0, total_groom: 0, total_slips: 0 });
        setMonthlyData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-lg text-gray-500">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">ภาพรวมระบบ</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <FaCalendarAlt className="text-purple-500 text-2xl" />
            <div>
              <p className="text-sm text-gray-500">จำนวนงานอีเว้นต์</p>
              <p className="text-xl font-bold text-purple-800">{eventCount.toLocaleString()} งาน</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <FaEnvelopeOpenText className="text-pink-500 text-2xl" />
            <div>
              <p className="text-sm text-gray-500">คำอวยพรทั้งหมด</p>
              <p className="text-xl font-bold text-pink-800">{wishCount.toLocaleString()} ข้อความ</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <FaMoneyBillWave className="text-green-500 text-2xl" />
            <div>
              <p className="text-sm text-gray-500">ยอดเงินสลิปทั้งหมด</p>
              <p className="text-xl font-bold text-green-800">{slipSummary.total.toLocaleString()} บาท</p>
              <p className="text-xs text-gray-400 mt-1">เจ้าสาว: {slipSummary.total_bride.toLocaleString()} | เจ้าบ่าว: {slipSummary.total_groom.toLocaleString()}</p>
              <p className="text-xs text-gray-400">{slipSummary.total_slips.toLocaleString()} สลิป</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <FaUserShield className="text-blue-500 text-2xl" />
            <div>
              <p className="text-sm text-gray-500">ประเภทบัญชี</p>
              <p className="text-xl font-bold text-blue-800">Premium</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <button onClick={() => navigate('/dashboard?page=events')} className="bg-purple-100 hover:bg-purple-200 text-purple-800 font-semibold py-3 rounded-xl shadow flex flex-col items-center gap-2">
          <FaCalendarAlt className="text-2xl" />
          จัดการงานอีเว้นต์
        </button>
        <button onClick={() => navigate('/dashboard?page=wish-gallery')} className="bg-pink-100 hover:bg-pink-200 text-pink-800 font-semibold py-3 rounded-xl shadow flex flex-col items-center gap-2">
          <FaEnvelopeOpenText className="text-2xl" />
          ดูคำอวยพร
        </button>
        <button onClick={() => navigate('/dashboard?page=slip-summary')} className="bg-green-100 hover:bg-green-200 text-green-800 font-semibold py-3 rounded-xl shadow flex flex-col items-center gap-2">
          <FaMoneyBillWave className="text-2xl" />
          ดูยอดสลิป
        </button>
        <button onClick={() => navigate('/dashboard?page=settings-event')} className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-3 rounded-xl shadow flex flex-col items-center gap-2">
          <FaCog className="text-2xl" />
          ตั้งค่าระบบ
        </button>
      </div>

      {/* Monthly Event Chart */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-purple-800">จำนวนงานต่อเดือน</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="events" fill="#a855f7" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DashboardOverview;
