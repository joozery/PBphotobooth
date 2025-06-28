import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://pbphoto-api-fae29207c672.herokuapp.com";

export default function UploadSlipForm() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [name, setName] = useState("");
  const [side, setSide] = useState("groom");
  const [amount, setAmount] = useState("");
  const [slip, setSlip] = useState(null);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    axios.get(`${BASE_URL}/api/events/${eventId}`)
      .then(res => setEvent(res.data))
      .catch(err => {
        Swal.fire({ icon: 'error', title: 'ไม่พบข้อมูลงาน', text: 'ไม่สามารถโหลดข้อมูลงานได้' });
        navigate(-1);
      })
      .finally(() => setLoading(false));
  }, [eventId]);

  // ฟังก์ชันคัดลอก
  const handleCopy = () => {
    const number = side === 'groom' ? event?.promptpay_groom : event?.promptpay_bride;
    if (!number) return;
    navigator.clipboard.writeText(number);
    Swal.fire({
      icon: "success",
      title: "คัดลอกหมายเลขพร้อมเพย์แล้ว!",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
  };

  // สร้าง QR url
  const getQR = (number) => number ? `https://promptpay.io/${number}.png` : "https://promptpay.io/0000000000.png";

  // ฟังก์ชันส่งสลิป
  const handleSubmit = async () => {
    if (!name.trim()) {
      Swal.fire({ icon: 'warning', title: 'กรุณากรอกชื่อ' });
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      Swal.fire({ icon: 'warning', title: 'กรุณากรอกจำนวนเงิน' });
      return;
    }
    if (!slip) {
      Swal.fire({ icon: 'warning', title: 'กรุณาแนบสลิป' });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('slip', slip);
      formData.append('name', name);
      formData.append('side', side);
      formData.append('amount', amount);
      formData.append('eventId', eventId);

      const response = await axios.post(`${BASE_URL}/api/slips/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      Swal.fire({
        icon: 'success',
        title: 'ส่งสลิปสำเร็จ!',
        text: 'ขอบคุณสำหรับการโอนเงิน',
        showConfirmButton: false,
        timer: 2000
      });

      // รีเซ็ตฟอร์ม
      setName("");
      setAmount("");
      setSlip(null);
      
      // กลับไปหน้าหลักของงาน
      setTimeout(() => navigate(`/event/${eventId}`), 2000);

    } catch (error) {
      console.error('Error uploading slip:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถส่งสลิปได้ กรุณาลองใหม่อีกครั้ง'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6">กำลังโหลดข้อมูล...</div>;
  if (!event) return <div className="p-6">ไม่พบข้อมูลงาน</div>;

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-100 font-prompt">
      <div className="flex-1 flex flex-col justify-between w-full h-full">
        <div className="w-full h-full max-w-lg mx-auto bg-white rounded-none shadow-lg flex flex-col justify-between p-0">
          {/* Header */}
          <div className="flex items-center px-6 pt-6 pb-2">
            <button onClick={() => navigate(-1)} className="text-blue-600 text-xl mr-2">←</button>
            <h2 className="text-lg font-semibold text-blue-700">แนบสลิปพร้อมเพย์</h2>
          </div>
          {/* QR Section */}
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center mb-2 mx-6">
            <img src={getQR(side === 'groom' ? event.promptpay_groom : event.promptpay_bride)} alt="QR" className="w-40 h-40 object-contain mb-2" />
            <div className="text-xs text-gray-700 mb-1">ชื่อบัญชี: {side === 'groom' ? event.groom_label || 'เจ้าบ่าว' : event.bride_label || 'เจ้าสาว'}</div>
            <div className="text-xs text-gray-700 mb-1">หมายเลขพร้อมเพย์: {side === 'groom' ? event.promptpay_groom : event.promptpay_bride}</div>
            <button className="text-blue-600 text-xs underline" onClick={handleCopy}>คัดลอก</button>
          </div>
          {/* Slip Upload */}
          <div className="mx-6">
            <label className="block text-sm font-medium mb-1 text-gray-600">รูปสลิปของคุณ</label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="slip-upload"
                onChange={e => setSlip(e.target.files[0])}
              />
              <label htmlFor="slip-upload" className="bg-blue-600 text-white px-4 py-2 rounded shadow cursor-pointer">
                + แนบสลิป
              </label>
              {slip && <span className="text-xs text-green-600">{slip.name}</span>}
            </div>
          </div>
          {/* Name */}
          <div className="mx-6">
            <label className="block text-sm font-medium mb-1 text-gray-600">ชื่อ</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-300 transition"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="ชื่อของคุณ"
            />
          </div>
          {/* Side */}
          <div className="flex gap-4 mb-2 mx-6">
            <label className="flex items-center gap-1 text-sm">
              <input type="radio" checked={side === 'groom'} onChange={() => setSide('groom')} />
              {event.groom_label || 'เจ้าบ่าว'}
            </label>
            <label className="flex items-center gap-1 text-sm">
              <input type="radio" checked={side === 'bride'} onChange={() => setSide('bride')} />
              {event.bride_label || 'เจ้าสาว'}
            </label>
          </div>
          {/* Amount */}
          <div className="mx-6">
            <label className="block text-sm font-medium mb-1 text-gray-600">จำนวนเงิน</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-300 transition"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
            />
          </div>
          {/* Buttons */}
          <div className="flex gap-2 mt-6 w-full px-6 pb-6">
            <button
              onClick={() => navigate(-1)}
              disabled={submitting}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-full font-semibold shadow hover:bg-gray-300 transition disabled:opacity-50"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 bg-blue-700 text-white py-2 rounded-full font-semibold shadow hover:bg-blue-800 transition disabled:opacity-50"
            >
              {submitting ? 'กำลังส่ง...' : 'ส่ง'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}