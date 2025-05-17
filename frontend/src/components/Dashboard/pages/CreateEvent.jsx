import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaRegCalendarPlus, FaSave } from 'react-icons/fa';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://pbphoto-api-fae29207c672.herokuapp.com";

function CreateEvent() {
  const [form, setForm] = useState({
    name: '',
    date: '',
    location: '',
  });
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("date", form.date);
      formData.append("location", form.location);
      if (coverImage) {
        formData.append("cover", coverImage);
      }

      await axios.post(`${BASE_URL}/api/events`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('❌ Create Event Error:', error);
      alert('ไม่สามารถสร้างงานได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 py-10 px-4 font-prompt">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-purple-700 mb-6 flex items-center gap-2">
          <FaRegCalendarPlus className="text-purple-500" /> สร้างงานอีเว้นต์ใหม่
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium mb-1">ชื่องาน</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
              placeholder="เช่น งานแต่งคุณเอ & คุณบี"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">วันที่จัด</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">สถานที่จัดงาน</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded"
              placeholder="เช่น โรงแรม The Grand Bangkok"
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium mb-1">อัปโหลดภาพหน้าปก</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
            {previewUrl && (
              <img src={previewUrl} alt="Preview" className="mt-3 max-h-64 w-auto rounded-md shadow-md" />
            )}
          </div>

          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition flex items-center gap-2"
            >
              <FaSave />
              {loading ? 'กำลังบันทึก...' : 'บันทึกงาน'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;
