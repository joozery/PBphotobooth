// src/pages/EventDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaPenNib, FaReceipt, FaRegEye } from "react-icons/fa";
import axios from "axios";
import { useTranslation } from 'react-i18next';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://pbphoto-api-fae29207c672.herokuapp.com";

export default function EventDetail() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [, forceUpdate] = useState({}); // เพิ่ม state สำหรับ force update
  const { t, i18n } = useTranslation();

  // ฟังก์ชันสำหรับเปลี่ยนภาษา
  const changeLanguage = (lng) => {
    console.log('🔄 Changing language to:', lng);
    i18n.changeLanguage(lng);
    forceUpdate({}); // บังคับให้ component re-render
    console.log('✅ Language changed to:', i18n.language);
  };

  // ฟังก์ชันสำหรับเรียก API
  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`🔄 Fetching event ${eventId}`);
      
      const response = await axios.get(`${BASE_URL}/api/events/${eventId}`);
      
      console.log(`✅ Event ${eventId} fetched successfully`);
      console.log('🔍 Full event data:', response.data);
      console.log('🔍 Wish button text EN from API:', response.data.wish_button_text_en);
      console.log('🔍 Slip button text EN from API:', response.data.slip_button_text_en);
      console.log('🔍 View wishes button text EN from API:', response.data.view_wishes_button_text_en);
      
      setEvent(response.data);
    } catch (err) {
      console.error(`❌ Error fetching event:`, err);
      setError('ไม่สามารถโหลดข้อมูลงานได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId, i18n.language]); // เพิ่ม i18n.language ใน dependency

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('กำลังโหลดข้อมูล...')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchEvent}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">{t('ไม่พบข้อมูลงาน')}</p>
      </div>
    );
  }

  const getWishButtonText = () => {
    if (!event) return '';
    console.log('🔍 Debug - Language:', i18n.language);
    console.log('🔍 Debug - Event wish_button_text_en:', event.wish_button_text_en);
    console.log('🔍 Debug - Event wish_button_text:', event.wish_button_text);
    
    if (i18n.language === 'en') {
      return event.wish_button_text_en || event.wish_button_text || 'เริ่มเขียนคำอวยพร';
    }
    return event.wish_button_text || 'เริ่มเขียนคำอวยพร';
  };
  const getSlipButtonText = () => {
    if (!event) return '';
    console.log('🔍 Debug - Slip button EN:', event.slip_button_text_en);
    
    if (i18n.language === 'en') {
      return event.slip_button_text_en || event.slip_button_text || 'แนบสลิปพร้อมเพย์';
    }
    return event.slip_button_text || 'แนบสลิปพร้อมเพย์';
  };
  const getViewWishesButtonText = () => {
    if (!event) return '';
    console.log('🔍 Debug - View wishes button EN:', event.view_wishes_button_text_en);
    
    if (i18n.language === 'en') {
      return event.view_wishes_button_text_en || event.view_wishes_button_text || 'ดูรูป card อวยพรทั้งหมด';
    }
    return event.view_wishes_button_text || 'ดูรูป card อวยพรทั้งหมด';
  };

  return (
    <div className="w-screen h-screen font-prompt flex justify-center items-center bg-[#eee]">
      <div
        className="w-full max-w-xl h-[100svh] bg-cover bg-center bg-no-repeat flex flex-col justify-end shadow-xl rounded-none border border-white relative"
        style={{
          backgroundImage: `url(${event.cover_image || "/default-bg.jpg"})`,
        }}
      >
        {/* Language Switcher */}
        <div className="absolute top-4 right-4 flex gap-2 z-20">
          <button
            onClick={() => changeLanguage('th')}
            className={`px-3 py-1 text-xs rounded ${i18n.language === 'th' ? 'bg-white text-black' : 'bg-black bg-opacity-50 text-white'}`}
          >
            TH
          </button>
          <button
            onClick={() => changeLanguage('en')}
            className={`px-3 py-1 text-xs rounded ${i18n.language === 'en' ? 'bg-white text-black' : 'bg-black bg-opacity-50 text-white'}`}
          >
            EN
          </button>
        </div>

        {/* Buttons Container - ย้ายไปด้านล่าง */}
        <div className="w-full px-6 pb-6 z-10 flex flex-col gap-3">
          {event.show_wish_button === 1 && (
            <button
              onClick={() => navigate(`/wish/${eventId}`)}
              className="w-full py-3 rounded-full shadow-lg flex items-center justify-center gap-2 text-sm font-semibold"
              style={{
                backgroundColor: event.wish_button_bg || "#1d4ed8",
                color: event.wish_button_text_color || "#ffffff",
              }}
            >
              <FaPenNib className="text-base" />
              {getWishButtonText()}
            </button>
          )}

          {event.show_slip_button === 1 && (
            <button
              onClick={() => navigate(`/upload-slip/${eventId}`)}
              className="w-full py-3 rounded-full shadow flex items-center justify-center gap-2 text-sm font-medium border"
              style={{
                backgroundColor: event.slip_button_bg || "#ffffff",
                color: event.slip_button_text_color || "#1d4ed8",
              }}
            >
              <FaReceipt className="text-base" />
              {getSlipButtonText()}
            </button>
          )}

          {event.show_view_wishes_button === 1 && (
            <button
              onClick={() => navigate(`/wish-gallery-list/${eventId}`)}
              className="w-full py-3 rounded-full shadow flex items-center justify-center gap-2 text-sm font-medium border"
              style={{
                backgroundColor: event.view_wishes_button_bg || "#f97316",
                color: event.view_wishes_button_text_color || "#ffffff",
              }}
            >
              <FaRegEye className="text-base" />
              {getViewWishesButtonText()}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}