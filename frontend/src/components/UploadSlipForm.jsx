import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function UploadSlipForm() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [side, setSide] = useState("groom");
  const [amount, setAmount] = useState("");
  const [slip, setSlip] = useState(null);

  // ฟังก์ชันคัดลอก
  const handleCopy = () => {
    navigator.clipboard.writeText("0909636552");
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

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-100 font-prompt">
      <div className="flex-1 flex flex-col justify-between w-full h-full">
        <div className="w-full h-full max-w-lg mx-auto bg-white rounded-none shadow-lg flex flex-col justify-between p-0">
          {/* Header */}
          <div className="flex items-center px-6 pt-6 pb-2">
            <button onClick={() => navigate(-1)} className="text-blue-600 text-xl mr-2">←</button>
            <h2 className="text-lg font-semibold text-blue-700">แนบสลิปพร้อมเพย์</h2>
          </div>
          {/* DEMO bar */}
          <div className="bg-yellow-100 text-yellow-700 text-xs text-center py-1 mx-6 rounded mb-2">
            DEMO สำหรับทดสอบใช้งาน
          </div>
          {/* QR Section */}
          <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center mb-2 mx-6">
            <img src="https://promptpay.io/0909636552.png" alt="QR" className="w-40 h-40 object-contain mb-2" />
            <div className="text-xs text-gray-700 mb-1">ชื่อบัญชี: Thanapol Wongjaroen</div>
            <div className="text-xs text-gray-700 mb-1">หมายเลขพร้อมเพย์: 0909636552</div>
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
              เจ้าบ่าว
            </label>
            <label className="flex items-center gap-1 text-sm">
              <input type="radio" checked={side === 'bride'} onChange={() => setSide('bride')} />
              เจ้าสาว
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
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-full font-semibold shadow hover:bg-gray-300 transition"
            >
              ยกเลิก
            </button>
            <button
              className="flex-1 bg-blue-700 text-white py-2 rounded-full font-semibold shadow hover:bg-blue-800 transition"
            >
              ส่ง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}