import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import { Hearts } from '@agney/react-loading';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError('');
    setLoading(true);

    // เคลียร์ token เก่าก่อน login ใหม่
    localStorage.removeItem('admin-auth');
    localStorage.removeItem('admin-token');
    localStorage.removeItem('admin-info');

    try {
      const res = await axios.post(`${BASE_URL}/api/admin/login`, {
        email,
        password,
      });

      // ✅ Login สำเร็จ → เก็บข้อมูล
      localStorage.setItem('admin-auth', 'true');
      localStorage.setItem('admin-token', res.data.token);
      localStorage.setItem('admin-info', JSON.stringify(res.data.admin));

      console.log('✅ TOKEN:', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-purple-100 p-4 rounded-full mb-3">
            <FaLock className="text-purple-600 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-purple-700">เข้าสู่ระบบผู้ดูแล</h2>
          <p className="text-sm text-gray-500 mt-1">กรุณากรอกข้อมูลเพื่อเข้าสู่ระบบ</p>
        </div>

        <form onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-100 text-red-600 text-sm rounded px-3 py-2 mb-4 text-center">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">อีเมล</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@pb.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 text-gray-700">รหัสผ่าน</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-medium transition-all flex justify-center items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Hearts width="20" className="text-white" />
                <span>กำลังเข้าสู่ระบบ...</span>
              </>
            ) : (
              'เข้าสู่ระบบ'
            )}
          </button>
        </form>

        <p className="text-xs text-center text-gray-400 mt-6">
          PBPhotoBooth Admin © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
