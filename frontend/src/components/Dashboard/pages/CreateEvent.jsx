import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSave, FaRegImage } from 'react-icons/fa';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://pbphoto-api-fae29207c672.herokuapp.com";

function CreateEvent() {
  const [form, setForm] = useState({
    title: '',
    eventDate: '',
    showWishButton: true,
    wishButtonText: 'เริ่มเขียนคำอวยพร',
    wishButtonBg: '#1d4ed8',
    wishButtonTextColor: '#ffffff',

    showSlipButton: true,
    slipButtonText: 'แนบสลิปพร้อมเพย์',
    slipButtonBg: '#ffffff',
    slipButtonTextColor: '#1d4ed8',
  });

  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
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
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
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
        <h2 className="text-2xl font-bold text-purple-700 mb-6 flex items-center gap-2">
          <FaRegImage className="text-purple-500" /> สร้างงานอีเว้นต์
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title and Date */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">ชื่องาน</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
                placeholder="เช่น งานแต่งคุณเอ & คุณบี"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">วันที่จัดงาน</label>
              <input
                type="date"
                name="eventDate"
                value={form.eventDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>
          </div>

          {/* Cover Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">อัปโหลดภาพหน้าปก</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-3 max-h-64 w-auto rounded-md shadow-md"
              />
            )}
          </div>

          {/* Wish Button */}
<div className="grid md:grid-cols-2 gap-6">
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        name="showWishButton"
        checked={form.showWishButton}
        onChange={handleChange}
      />
      แสดงปุ่ม “คำอวยพร”
    </label>

    <input
      type="text"
      name="wishButtonText"
      className="w-full px-3 py-2 border rounded"
      placeholder="ข้อความบนปุ่มคำอวยพร"
      value={form.wishButtonText}
      onChange={handleChange}
    />

    <div className="flex items-center gap-4">
      <div>
        <label className="text-xs block">สีพื้นหลัง</label>
        <input
          type="color"
          name="wishButtonBg"
          value={form.wishButtonBg}
          onChange={handleChange}
          className="w-10 h-10"
        />
      </div>
      <div>
        <label className="text-xs block">สีข้อความ</label>
        <input
          type="color"
          name="wishButtonTextColor"
          value={form.wishButtonTextColor}
          onChange={handleChange}
          className="w-10 h-10"
        />
      </div>
    </div>

    {/* ✅ Live Preview */}
    <div className="pt-2">
      <span className="text-xs text-gray-500">Preview:</span>
      <button
        type="button"
        className="w-full px-4 py-2 mt-2 rounded shadow"
        style={{
          backgroundColor: form.wishButtonBg,
          color: form.wishButtonTextColor,
        }}
      >
        {form.wishButtonText}
      </button>
    </div>
  </div>


          

           {/* Slip Button */}
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        name="showSlipButton"
        checked={form.showSlipButton}
        onChange={handleChange}
      />
      แสดงปุ่ม “แนบสลิป”
    </label>

    <input
      type="text"
      name="slipButtonText"
      className="w-full px-3 py-2 border rounded"
      placeholder="ข้อความบนปุ่มแนบสลิป"
      value={form.slipButtonText}
      onChange={handleChange}
    />

    <div className="flex items-center gap-4">
      <div>
        <label className="text-xs block">สีพื้นหลัง</label>
        <input
          type="color"
          name="slipButtonBg"
          value={form.slipButtonBg}
          onChange={handleChange}
          className="w-10 h-10"
        />
      </div>
      <div>
        <label className="text-xs block">สีข้อความ</label>
        <input
          type="color"
          name="slipButtonTextColor"
          value={form.slipButtonTextColor}
          onChange={handleChange}
          className="w-10 h-10"
        />
      </div>
    </div>

    {/* ✅ Live Preview */}
    <div className="pt-2">
      <span className="text-xs text-gray-500">Preview:</span>
      <button
        type="button"
        className="w-full px-4 py-2 mt-2 rounded shadow"
        style={{
          backgroundColor: form.slipButtonBg,
          color: form.slipButtonTextColor,
        }}
      >
        {form.slipButtonText}
      </button>
    </div>
  </div>
</div>

{/* View Wishes Button */}
<div className="space-y-2">
  <label className="flex items-center gap-2 text-sm">
    <input
      type="checkbox"
      name="showViewWishesButton"
      checked={form.showViewWishesButton}
      onChange={handleChange}
    />
    แสดงปุ่ม “ดูคำอวยพร”
  </label>

  <input
    type="text"
    name="viewWishesButtonText"
    className="w-full px-3 py-2 border rounded"
    placeholder="ข้อความบนปุ่มดูคำอวยพร"
    value={form.viewWishesButtonText}
    onChange={handleChange}
  />

  <div className="flex items-center gap-4">
    <div>
      <label className="text-xs block">สีพื้นหลัง</label>
      <input
        type="color"
        name="viewWishesButtonBg"
        value={form.viewWishesButtonBg}
        onChange={handleChange}
        className="w-10 h-10"
      />
    </div>
    <div>
      <label className="text-xs block">สีข้อความ</label>
      <input
        type="color"
        name="viewWishesButtonTextColor"
        value={form.viewWishesButtonTextColor}
        onChange={handleChange}
        className="w-10 h-10"
      />
    </div>
  </div>

  {/* ✅ Live Preview */}
  <div className="pt-2">
    <span className="text-xs text-gray-500">Preview:</span>
    <button
      type="button"
      className="w-full px-4 py-2 mt-2 rounded shadow"
      style={{
        backgroundColor: form.viewWishesButtonBg,
        color: form.viewWishesButtonTextColor,
      }}
    >
      {form.viewWishesButtonText}
    </button>
  </div>
</div>


          {/* Save Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition flex items-center gap-2"
            >
              <FaSave />
              {loading ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;
