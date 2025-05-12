// components/Dashboard/pages/DashboardOverview.jsx
import React from 'react';
import { FaCalendarAlt, FaEnvelopeOpenText, FaUserShield } from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const monthlyData = [
  { month: 'ม.ค.', events: 3 },
  { month: 'ก.พ.', events: 5 },
  { month: 'มี.ค.', events: 2 },
  { month: 'เม.ย.', events: 6 },
  { month: 'พ.ค.', events: 8 },
  { month: 'มิ.ย.', events: 4 },
  { month: 'ก.ค.', events: 7 },
  { month: 'ส.ค.', events: 3 },
  { month: 'ก.ย.', events: 1 },
  { month: 'ต.ค.', events: 4 },
  { month: 'พ.ย.', events: 2 },
  { month: 'ธ.ค.', events: 5 },
];

function DashboardOverview() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">ภาพรวมระบบ</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <FaCalendarAlt className="text-purple-500 text-2xl" />
            <div>
              <p className="text-sm text-gray-500">จำนวนงานอีเว้นต์</p>
              <p className="text-xl font-bold text-purple-800">58 งาน</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <FaEnvelopeOpenText className="text-pink-500 text-2xl" />
            <div>
              <p className="text-sm text-gray-500">คำอวยพรทั้งหมด</p>
              <p className="text-xl font-bold text-pink-800">142 ข้อความ</p>
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
