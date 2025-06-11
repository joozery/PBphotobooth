import React, { useState, useEffect } from 'react';
import {
  FaHome,
  FaCalendarAlt,
  FaRegEnvelopeOpen,
  FaCog,
  FaBell,
  FaUserShield,
  FaAngleDown,
  FaMoneyBillWave,
} from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { BsCamera } from 'react-icons/bs';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function Sidebar({ onSelectPage, selectedPage }) {
  const [collapsed, setCollapsed] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const navigate = useNavigate();

  const toggleSidebar = () => setCollapsed(!collapsed);

  useEffect(() => {
    const token = localStorage.getItem('admin-token');
    if (!token) return;

    axios
      .get(`${BASE_URL}/api/admin/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const name = res.data?.admin?.name?.trim();
        const email = res.data?.admin?.email?.trim();
        setAdminName(name || 'คุณผู้ใช้');
        setAdminEmail(email || '');
      })
      .catch((err) => {
        console.error('❌ ไม่สามารถโหลดชื่อผู้ใช้ได้:', err);
        localStorage.removeItem('admin-auth');
        localStorage.removeItem('admin-token');
        localStorage.removeItem('admin-info');
        navigate('/admin/login');
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin-auth');
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin-info');
    navigate('/admin/login');
  };

  const menu = [
    { label: 'หน้าหลัก', icon: <FaHome />, page: '' },
    { label: 'จัดการงานอีเว้นต์', icon: <FaCalendarAlt />, page: 'events' },
    { label: 'เทมเพลตคำอวยพร', icon: <FaRegEnvelopeOpen />, page: 'manage-templates' },
    { label: 'อัพโหลด', icon: <FaCog />, page: 'settings-event' }, // ✅ เพิ่มตรงนี้
    { label: 'ดูยอดโอนสลิป', icon: <FaMoneyBillWave />, page: 'slip-summary' },
    { label: 'อัลบั้มคำอวยพร', icon: <FaRegEnvelopeOpen />, page: 'wish-gallery' }
  ];

  const settings = [
    { label: 'การตั้งค่า', icon: <FaCog /> },
    { label: 'แจ้งเตือน', icon: <FaBell /> },
    { label: 'ความปลอดภัย', icon: <FaUserShield /> },
  ];

  return (
    <div
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } h-screen bg-gradient-to-b from-pink-100 via-purple-100 to-blue-100 text-gray-800 shadow-md transition-all duration-300 flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-purple-200">
        <div className="flex items-center gap-2">
          <BsCamera className="text-purple-500 text-xl" />
          {!collapsed && <span className="text-lg font-bold font-prompt">PBPhotoBooth</span>}
        </div>
        <button onClick={toggleSidebar}>
          <FaAngleDown
            className={`transition-transform ${
              collapsed ? 'rotate-90' : ''
            } text-purple-500 hover:text-purple-700`}
          />
        </button>
      </div>

      {/* Main Menu */}
      <div className="px-2 flex-1 overflow-y-auto">
        <p className="text-xs text-purple-400 px-3 mt-4 mb-2">{!collapsed && 'Main Menu'}</p>
        {menu.map((item) => (
          <button
            key={item.page}
            onClick={() => onSelectPage(item.page)}
            className={`flex items-center gap-3 px-4 py-3 rounded-md w-full transition-all
              ${
                selectedPage === item.page
                  ? 'bg-purple-200 text-purple-900 font-semibold'
                  : 'text-purple-700 hover:bg-purple-100 hover:text-purple-900'
              }`}
          >
            <span className="text-lg">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}

        <div className="border-t border-purple-200 my-4"></div>

        <p className="text-xs text-purple-400 px-3 mb-2">{!collapsed && 'Preferences'}</p>
        {settings.map((item, idx) => (
          <button
            key={idx}
            className={`flex items-center gap-3 px-4 py-3 rounded-md w-full text-purple-700 hover:bg-purple-100 hover:text-purple-900`}
          >
            <span className="text-lg">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </div>

      {/* Profile + Logout */}
      <div className="p-4 border-t border-purple-200">
        <div className="flex items-center gap-3 mb-3">
          <img
            src="https://i.pravatar.cc/40"
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-medium text-purple-800">
                {adminName ? `คุณ${adminName}` : 'คุณผู้ใช้'}
              </span>
              <span className="text-sm text-purple-600">{adminEmail}</span>
            </div>
          )}
        </div>

        {!collapsed && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-100 px-3 py-2 rounded-md transition-all"
          >
            <FiLogOut className="text-base" />
            ออกจากระบบ
          </button>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
