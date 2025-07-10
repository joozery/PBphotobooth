import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import PromptPay from 'promptpay-qr';
import { useTranslation } from 'react-i18next';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://pbphoto-api-fae29207c672.herokuapp.com";

// รายการธนาคารหลักในไทย
const bankOptions = [
  { key: "kbank", label: "ธนาคารกสิกรไทย" },
  { key: "bbl", label: "ธนาคารกรุงเทพ" },
  { key: "scb", label: "ธนาคารไทยพาณิชย์" },
  { key: "ktb", label: "ธนาคารกรุงไทย" },
  { key: "bay", label: "ธนาคารกรุงศรีอยุธยา" },
  { key: "tmb", label: "ธนาคารทหารไทย" },
  { key: "gsb", label: "ธนาคารออมสิน" },
  { key: "ghb", label: "ธนาคารอาคารสงเคราะห์" },
  { key: "uob", label: "ธนาคารยูโอบี" },
  { key: "lhb", label: "ธนาคารแลนด์ แอนด์ เฮาส์" },
  { key: "kk", label: "ธนาคารเกียรตินาคิน" },
  { key: "tisco", label: "ธนาคารทิสโก้" },
  { key: "cimb", label: "ธนาคารซีไอเอ็มบี ไทย" },
  { key: "ibank", label: "ธนาคารอิสลามแห่งประเทศไทย" },
];

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
  const { t } = useTranslation();

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    axios.get(`${BASE_URL}/api/events/${eventId}`)
      .then(res => {
        setEvent(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading event:', err);
        Swal.fire({ 
          icon: 'error', 
          title: 'ไม่พบข้อมูลงาน', 
          text: 'ไม่สามารถโหลดข้อมูลงานได้' 
        });
        setLoading(false);
        navigate(-1);
      });
  }, [eventId, navigate]);

  // ฟังก์ชันคัดลอกพร้อมเพย์
  const handleCopyPromptPay = () => {
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

  // ฟังก์ชันคัดลอกเลขบัญชี
  const handleCopyAccountNumber = (accountNumber) => {
    if (!accountNumber) return;
    navigator.clipboard.writeText(accountNumber);
    Swal.fire({
      icon: "success",
      title: "คัดลอกเลขบัญชีแล้ว!",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
  };

  // สร้าง QR url (รองรับทั้งเบอร์โทรและเลขบัตรประชาชน)
  const getQR = (number) => {
    if (!number) return "https://promptpay.io/0000000000.png";
    // ตรวจสอบว่าเป็นเบอร์โทร (10 หลัก) หรือเลขบัตร (13 หลัก)
    const isPhone = /^0[0-9]{9}$/.test(number);
    const isCitizen = /^[0-9]{13}$/.test(number);
    if (!isPhone && !isCitizen) return "https://promptpay.io/0000000000.png";
    // ไม่ต้อง generatePayload ก็ได้ ใช้ promptpay.io ได้เลย
    return `https://promptpay.io/${number}.png`;
  };

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

  // ตรวจสอบว่ามีข้อมูลพร้อมเพย์หรือไม่
  const hasPromptPay = (side) => {
    if (side === 'groom') {
      return event?.promptpay_groom && event.promptpay_groom.trim() !== '';
    } else {
      return event?.promptpay_bride && event.promptpay_bride.trim() !== '';
    }
  };

  // ตรวจสอบว่ามีข้อมูลบัญชีธนาคารหรือไม่
  const hasBankAccount = (side) => {
    if (side === 'groom') {
      return event?.groom_account_number && event.groom_account_number.trim() !== '';
    } else {
      return event?.bride_account_number && event.bride_account_number.trim() !== '';
    }
  };

  // ตรวจสอบว่ามี QR Code หรือไม่
  const hasQRCode = (side) => {
    if (side === 'groom') {
      return event?.groom_qr_code && event.groom_qr_code.trim() !== '';
    } else {
      return event?.bride_qr_code && event.bride_qr_code.trim() !== '';
    }
  };

  if (loading) return <div className="p-6">{t('กำลังโหลดข้อมูล...')}</div>;
  if (!event) return <div className="p-6">{t('ไม่พบข้อมูลงาน')}</div>;

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-100 font-prompt">
      <div className="flex-1 flex flex-col justify-between w-full h-full">
        <div className="w-full h-full max-w-lg mx-auto bg-white rounded-none shadow-lg flex flex-col justify-between p-0">
          {/* Header */}
          <div className="flex items-center px-6 pt-6 pb-2">
            <button onClick={() => navigate(-1)} className="text-blue-600 text-xl mr-2">←</button>
            <h2 className="text-lg font-semibold text-blue-700">{t('แนบสลิปพร้อมเพย์')}</h2>
          </div>

          {/* Payment Methods Section */}
          <div className="flex-1 overflow-y-auto px-6">
            {/* Side Selection */}
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-1 text-sm">
                <input type="radio" checked={side === 'groom'} onChange={() => setSide('groom')} />
                {event.groom_label ? event.groom_label : t('เจ้าบ่าว')}
              </label>
              <label className="flex items-center gap-1 text-sm">
                <input type="radio" checked={side === 'bride'} onChange={() => setSide('bride')} />
                {event.bride_label ? event.bride_label : t('เจ้าสาว')}
              </label>
            </div>

            {/* PromptPay Section - แสดงเฉพาะเมื่อมีข้อมูล */}
            {hasPromptPay(side) && (
              <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">พร้อมเพย์</h3>
                <img 
                  src={getQR(side === 'groom' ? event.promptpay_groom : event.promptpay_bride)} 
                  alt="QR" 
                  className="w-40 h-40 object-contain mb-2" 
                />
                <div className="text-xs text-gray-700 mb-1">
                  {t('ชื่อบัญชี')}: {side === 'groom' ? event.groom_label || t('เจ้าบ่าว') : event.bride_label || t('เจ้าสาว')}
                </div>
                <div className="text-xs text-gray-700 mb-2">
                  หมายเลขพร้อมเพย์: {side === 'groom' ? event.promptpay_groom : event.promptpay_bride}
                </div>
                <button 
                  className="text-blue-600 text-xs underline" 
                  onClick={handleCopyPromptPay}
                >
                  คัดลอกหมายเลขพร้อมเพย์
                </button>
              </div>
            )}

            {/* Bank Account Section - แสดงเฉพาะเมื่อมีข้อมูล */}
            {hasBankAccount(side) && (
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-medium text-blue-700 mb-2">บัญชีธนาคาร</h3>
                <div className="space-y-2">
                  <div className="text-xs text-gray-700">
                    <span className="font-medium">ธนาคาร:</span> {
                      bankOptions.find(bank => bank.key === (side === 'groom' ? event.groom_bank : event.bride_bank))?.label || 
                      (side === 'groom' ? event.groom_bank : event.bride_bank)
                    }
                  </div>
                  <div className="text-xs text-gray-700">
                    <span className="font-medium">ชื่อบัญชี:</span> {side === 'groom' ? event.groom_account_name : event.bride_account_name}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-700">
                      <span className="font-medium">เลขบัญชี:</span> {side === 'groom' ? event.groom_account_number : event.bride_account_number}
                    </span>
                    <button 
                      className="text-blue-600 text-xs underline" 
                      onClick={() => handleCopyAccountNumber(side === 'groom' ? event.groom_account_number : event.bride_account_number)}
                    >
                      คัดลอก
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* QR Code Section - แสดงเฉพาะเมื่อมี QR Code */}
            {hasQRCode(side) && (
              <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center mb-4">
                <h3 className="text-sm font-medium text-green-700 mb-2">QR Code ธนาคาร</h3>
                <img 
                  src={side === 'groom' ? event.groom_qr_code : event.bride_qr_code} 
                  alt="Bank QR" 
                  className="w-40 h-40 object-contain mb-2" 
                />
              </div>
            )}

            {/* Slip Upload */}
            <div className="mb-4">
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
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-600">{t('ชื่อ')}</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-300 transition"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="ชื่อของคุณ"
              />
            </div>

            {/* Amount */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-600">{t('จำนวนเงิน')}</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-300 transition"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                min="0"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-6 w-full px-6 pb-6">
            <button
              onClick={() => navigate(-1)}
              disabled={submitting}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-full font-semibold shadow hover:bg-gray-300 transition disabled:opacity-50"
            >
              {t('ยกเลิก')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 bg-blue-700 text-white py-2 rounded-full font-semibold shadow hover:bg-blue-800 transition disabled:opacity-50"
            >
              {submitting ? t('กำลังส่ง...') : t('ส่ง')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}