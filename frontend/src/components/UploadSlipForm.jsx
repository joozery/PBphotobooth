import React, { useState } from "react";
import { FaUpload } from "react-icons/fa";

export default function UploadSlipForm() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [side, setSide] = useState("groom");
  const [amount, setAmount] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✅ ส่งข้อมูลแล้ว (DEMO)");
  };

  return (
    <div className="min-h-screen font-prompt bg-[#f8f9fb] flex justify-center items-center px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="bg-yellow-400 text-xs text-center text-white font-semibold py-1">
          DEMO สำหรับทดสอบใช้งาน
        </div>

        <div className="px-6 py-4">
          {/* พร้อมเพย์ */}
          <h2 className="text-center font-bold text-lg mb-3">ข้อมูลพร้อมเพย์</h2>
          <div className="bg-white border rounded-lg p-4 shadow-sm text-center">
            <img
              src="/thai-qr-placeholder.png"
              alt="Thai QR"
              className="w-32 h-32 mx-auto mb-2"
            />
            <p className="text-sm text-gray-600">ชื่อบัญชี: Thanapol Wongjaroen</p>
            <p className="text-sm text-gray-600">หมายเลขพร้อมเพย์: 0909636552</p>
            <p className="text-blue-500 underline text-xs mt-1 cursor-pointer">คัดลอก</p>
          </div>

          {/* แนบสลิป */}
          <div className="mt-6">
            <label className="block text-sm font-semibold mb-1">รูปสลิปของคุณ</label>
            <div className="border border-dashed rounded-md p-4 bg-gray-50 text-center cursor-pointer hover:bg-gray-100">
              {file ? (
                <img
                  src={file}
                  alt="Slip Preview"
                  className="w-32 h-32 object-cover mx-auto rounded"
                />
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 text-gray-500">
                  <FaUpload className="text-xl" />
                  <span className="text-sm">+ แนบสลิป</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
          </div>

          {/* ฟอร์มกรอก */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm mb-1">ชื่อ</label>
              <input
                type="text"
                className="w-full border px-3 py-2 rounded-md text-sm"
                placeholder="ชื่อของคุณ"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1">แยกฝ่าย</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="side"
                    value="groom"
                    checked={side === "groom"}
                    onChange={() => setSide("groom")}
                  />
                  เจ้าบ่าว
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="side"
                    value="bride"
                    checked={side === "bride"}
                    onChange={() => setSide("bride")}
                  />
                  เจ้าสาว
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">จำนวนเงิน</label>
              <input
                type="number"
                step="0.01"
                className="w-full border px-3 py-2 rounded-md text-sm"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* ปุ่ม */}
            <div className="flex justify-between gap-4 mt-6">
              <button
                type="button"
                className="w-full bg-gray-200 text-gray-600 py-2 rounded-full"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-full font-semibold hover:bg-blue-700"
              >
                ส่ง
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}