import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { IoIosFemale, IoMdFemale } from "react-icons/io";
import {
  FaUser,
  FaStar,
  FaUserTie,
  FaHeart,
  FaSmile,
  FaCat,
  FaDog,
  FaRing,
  FaSave,
  FaRegImage,
} from "react-icons/fa";
import Swal from "sweetalert2";

//importicon

import beerIcon from "../../../assets/icons/beer.png";
import femaleIcon from "../../../assets/icons/female.png";
import maleIcon from "../../../assets/icons/male.png";
import manthaiIcon from "../../../assets/icons/manthai.png";
import thaicolorIcon from "../../../assets/icons/thaicolor.png";
import wineIcon from "../../../assets/icons/wine.png";
import womancolorIcon from "../../../assets/icons/womancolor.png";
import woomanthaiIcon from "../../../assets/icons/woomanthai.png";

const iconImageOptions = [
  { key: "beer", label: "Beer", src: beerIcon },
  { key: "female", label: "Female", src: femaleIcon },
  { key: "male", label: "Male", src: maleIcon },
  { key: "manthai", label: "Man Thai", src: manthaiIcon },
  { key: "thaicolor", label: "Thai Color", src: thaicolorIcon },
  { key: "wine", label: "Wine", src: wineIcon },
  { key: "womancolor", label: "Woman Color", src: womancolorIcon },
  { key: "woomanthai", label: "Woman Thai", src: woomanthaiIcon },
];

// 🔧 ตั้งค่าicon
// const iconOptions = {
//   FaUser: <FaUser />,
//   FaUserTie: <FaUserTie />,
//   FaHeart: <FaHeart />,
//   FaStar: <FaStar />,
//   FaSmile: <FaSmile />,
//   FaCat: <FaCat />,
//   FaDog: <FaDog />,
//   FaRing: <FaRing />,
//   IoIosFemale: <IoIosFemale />, // ✅ เพิ่ม
//   IoMdFemale: <IoMdFemale />, // ✅ เพิ่ม
// };

// 🔧 แปลงวันที่จาก ISO → YYYY-MM-DD สำหรับ input[type="date"]
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://pbphoto-api-fae29207c672.herokuapp.com";

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

function CreateEvent() {
  const { eventId } = useParams();
  const [form, setForm] = useState({
    title: "",
    eventDate: "",
    showWishButton: true,
    wishButtonText: "เริ่มเขียนคำอวยพร",
    wishButtonTextEn: "Start writing a wish",
    wishButtonBg: "#1d4ed8",
    wishButtonTextColor: "#ffffff",
    showSlipButton: true,
    slipButtonText: "แนบสลิปพร้อมเพย์",
    slipButtonTextEn: "Upload PromptPay slip",
    slipButtonBg: "#ffffff",
    slipButtonTextColor: "#1d4ed8",
    showViewWishesButton: true,
    viewWishesButtonText: "ดูรูป card อวยพรทั้งหมด",
    viewWishesButtonTextEn: "View all wish cards",
    viewWishesButtonBg: "#f97316",
    viewWishesButtonTextColor: "#ffffff",
    groom_label: "ฝ่ายเจ้าบ่าว",
    bride_label: "ฝ่ายเจ้าสาว",
    groom_icon: "FaUserTie",
    bride_icon: "FaUser",
    promptpay_groom: "",
    promptpay_bride: "",
    // เพิ่ม bank account settings
    showBankAccount: true,
    groom_bank: "",
    groom_account_number: "",
    groom_account_name: "",
    bride_bank: "",
    bride_account_number: "",
    bride_account_name: "",
  });

  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [coverImage2, setCoverImage2] = useState(null);
  const [previewUrl2, setPreviewUrl2] = useState(null);

  const [previewGroomIcon, setPreviewGroomIcon] = useState(null);
  const [previewBrideIcon, setPreviewBrideIcon] = useState(null);

  // เพิ่ม state สำหรับ dropdown และไฟล์
  const [groomIconKey, setGroomIconKey] = useState("");
  const [groomIconFile, setGroomIconFile] = useState(null);
  const [brideIconKey, setBrideIconKey] = useState("");
  const [brideIconFile, setBrideIconFile] = useState(null);

  // เพิ่ม state สำหรับ QR Code
  const [groomQRCode, setGroomQRCode] = useState(null);
  const [previewGroomQR, setPreviewGroomQR] = useState(null);
  const [brideQRCode, setBrideQRCode] = useState(null);
  const [previewBrideQR, setPreviewBrideQR] = useState(null);

  const [templateOptions, setTemplateOptions] = useState([]);

  // ✅ เพิ่ม debug log
  useEffect(() => {
    console.log("🔍 Current templateOptions:", templateOptions);
  }, [templateOptions]);

  useEffect(() => {
    const fetchEventAndTemplates = async () => {
      try {
        // ถ้าแก้ไข event → โหลดข้อมูล event
        if (eventId) {
          const res = await axios.get(`${BASE_URL}/api/events/${eventId}`);
          const data = res.data;

          // ตั้งค่า icon ฝ่ายเจ้าบ่าว
          if (data.groom_icon_image) {
            if (data.groom_icon_image.startsWith('http')) {
              setGroomIconKey("");
              setGroomIconFile(null);
              setPreviewGroomIcon(data.groom_icon_image);
            } else {
              setGroomIconKey(data.groom_icon_image);
              setGroomIconFile(null);
              setPreviewGroomIcon(null);
            }
          } else {
            setGroomIconKey("");
            setGroomIconFile(null);
            setPreviewGroomIcon(null);
          }

          // ตั้งค่า icon ฝ่ายเจ้าสาว
          if (data.bride_icon_image) {
            if (data.bride_icon_image.startsWith('http')) {
              setBrideIconKey("");
              setBrideIconFile(null);
              setPreviewBrideIcon(data.bride_icon_image);
            } else {
              setBrideIconKey(data.bride_icon_image);
              setBrideIconFile(null);
              setPreviewBrideIcon(null);
            }
          } else {
            setBrideIconKey("");
            setBrideIconFile(null);
            setPreviewBrideIcon(null);
          }

          setForm({
            title: data.title || "",
            eventDate: formatDate(data.event_date),
            showWishButton: !!data.show_wish_button,
            wishButtonText: data.wish_button_text,
            wishButtonTextEn: data.wish_button_text_en || "Start writing a wish",
            wishButtonBg: data.wish_button_bg,
            wishButtonTextColor: data.wish_button_text_color,
            showSlipButton: !!data.show_slip_button,
            slipButtonText: data.slip_button_text,
            slipButtonTextEn: data.slip_button_text_en || "Upload PromptPay slip",
            slipButtonBg: data.slip_button_bg,
            slipButtonTextColor: data.slip_button_text_color,
            showViewWishesButton: !!data.show_view_wishes_button,
            viewWishesButtonText: data.view_wishes_button_text,
            viewWishesButtonTextEn: data.view_wishes_button_text_en || "View all wish cards",
            viewWishesButtonBg: data.view_wishes_button_bg,
            viewWishesButtonTextColor: data.view_wishes_button_text_color,
            groom_label: data.groom_label || "ฝ่ายเจ้าบ่าว",
            bride_label: data.bride_label || "ฝ่ายเจ้าสาว",
            groom_icon: data.groom_icon || "FaUserTie",
            bride_icon: data.bride_icon || "FaUser",
            promptpay_groom: data.promptpay_groom || "",
            promptpay_bride: data.promptpay_bride || "",
            // เพิ่ม bank account settings
            showBankAccount: !!data.show_bank_account,
            groom_bank: data.groom_bank || "",
            groom_account_number: data.groom_account_number || "",
            groom_account_name: data.groom_account_name || "",
            bride_bank: data.bride_bank || "",
            bride_account_number: data.bride_account_number || "",
            bride_account_name: data.bride_account_name || "",
          });

          if (data.cover_image) {
            setPreviewUrl(data.cover_image);
          }

          if (data.cover_image2) {
            setPreviewUrl2(data.cover_image2);
          }

          // โหลด QR Code ที่มีอยู่
          if (data.groom_qr_code) {
            setPreviewGroomQR(data.groom_qr_code);
          }
          if (data.bride_qr_code) {
            setPreviewBrideQR(data.bride_qr_code);
          }

          // โหลด template ที่เลือกไว้ใน event
          const selectedTemplateRes = await axios.get(
            `${BASE_URL}/api/templates/event/${eventId}`
          );
          const selectedTemplateIds = selectedTemplateRes.data.map(
            (tpl) => tpl.id
          );

          // โหลด template ทั้งหมด
          const allTemplatesRes = await axios.get(`${BASE_URL}/api/templates`);
          console.log("🔍 All templates response:", allTemplatesRes.data);
          const allTemplates = allTemplatesRes.data.map((tpl) => ({
            ...tpl,
            show_template: selectedTemplateIds.includes(tpl.id),
          }));
          console.log("🔍 Final template options:", allTemplates);

          setTemplateOptions(allTemplates);
        } else {
          // ถ้าเป็นหน้าสร้างใหม่ → โหลด template ทั้งหมด (ไม่ติ๊ก)
          const allTemplatesRes = await axios.get(`${BASE_URL}/api/templates`);
          const allTemplates = allTemplatesRes.data.map((tpl) => ({
            ...tpl,
            show_template: false,
          }));

          setTemplateOptions(allTemplates);
        }
      } catch (err) {
        console.error("❌ โหลดข้อมูล event/template ผิดพลาด:", err);
      }
    };

    fetchEventAndTemplates();
  }, [eventId]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // อัพโหลดรูปที่ 2
  const handleImage2Change = (e) => {
    const file = e.target.files[0];
    setCoverImage2(file);
    if (file) {
      setPreviewUrl2(URL.createObjectURL(file));
    }
  };

  // อัพโหลด QR Code ฝ่ายเจ้าบ่าว
  const handleGroomQRChange = (e) => {
    const file = e.target.files[0];
    setGroomQRCode(file);
    if (file) {
      setPreviewGroomQR(URL.createObjectURL(file));
    }
  };

  // อัพโหลด QR Code ฝ่ายเจ้าสาว
  const handleBrideQRChange = (e) => {
    const file = e.target.files[0];
    setBrideQRCode(file);
    if (file) {
      setPreviewBrideQR(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      
      // Debug: ดูข้อมูลที่จะส่ง
      console.log('🔍 Form data before sending:', form);
      console.log('🔍 Wish button text EN:', form.wishButtonTextEn);
      console.log('🔍 Slip button text EN:', form.slipButtonTextEn);
      console.log('🔍 View wishes button text EN:', form.viewWishesButtonTextEn);
      
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
        console.log(`📤 Sending ${key}:`, value);
      });

      formData.set("promptpay_groom", form.promptpay_groom || "");
      formData.set("promptpay_bride", form.promptpay_bride || "");

      formData.set("groom_label", form.groom_label);
      formData.set("bride_label", form.bride_label);
      formData.set("groom_icon", form.groom_icon);
      formData.set("bride_icon", form.bride_icon);
      
      // groom icon
      if (groomIconFile) {
        formData.append("groom_icon_image", groomIconFile);
      } else if (groomIconKey) {
        formData.append("groom_icon_image", groomIconKey);
      } else {
        formData.append("groom_icon_image", "");
      }
      // bride icon
      if (brideIconFile) {
        formData.append("bride_icon_image", brideIconFile);
      } else if (brideIconKey) {
        formData.append("bride_icon_image", brideIconKey);
      } else {
        formData.append("bride_icon_image", "");
      }

      if (!eventId || coverImage) {
        formData.append("cover", coverImage);
      }

      if (!eventId || coverImage2) {
        formData.append("cover2", coverImage2);
      }

      // เพิ่ม QR Code ไฟล์
      if (!eventId || groomQRCode) {
        formData.append("groomQRCode", groomQRCode);
      } else if (previewGroomQR) {
        // ถ้าไม่ได้อัปโหลดใหม่ แต่มี url เดิม ให้ส่ง url เดิมไปด้วย
        formData.append("groom_qr_code_url", previewGroomQR);
      }
      if (!eventId || brideQRCode) {
        formData.append("brideQRCode", brideQRCode);
      } else if (previewBrideQR) {
        formData.append("bride_qr_code_url", previewBrideQR);
      }

      const selectedTemplateIds = templateOptions
        .filter((tpl) => tpl.show_template)
        .map((tpl) => tpl.id);
      formData.append("templateIds", JSON.stringify(selectedTemplateIds));

      if (eventId) {
        await axios.put(`${BASE_URL}/api/events/${eventId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        await Swal.fire({
          icon: "success",
          title: "แก้ไขงานสำเร็จ",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await axios.post(`${BASE_URL}/api/events`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        await Swal.fire({
          icon: "success",
          title: "สร้างงานสำเร็จ",
          showConfirmButton: false,
          timer: 1500,
        });
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Event Save Error:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถบันทึกงานได้",
      });
    } finally {
      setLoading(false);
    }
  };

  // const [wishSettings, setWishSettings] = useState({
  //   enableImageUpload: true,
  //   maxNameLength: 20,
  //   maxMessageLength: 200,
  //   requireAgreement: true,
  // });

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
              <label className="block text-sm font-medium mb-1">
                วันที่จัดงาน
              </label>
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
            <label className="block text-sm font-medium mb-1">
              อัปโหลดภาพหน้าปก
            </label>
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

          {/* Cover Upload2 */}
          <div>
            <label className="block text-sm font-medium mb-1">
              อัปโหลดภาพหน้าปกที่ 2
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImage2Change}
              className="w-full"
            />
            {previewUrl2 && (
              <img
                src={previewUrl2}
                alt="Preview2"
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
                แสดงปุ่ม "คำอวยพร"
              </label>

              <input
                type="text"
                name="wishButtonText"
                className="w-full px-3 py-2 border rounded"
                placeholder="ข้อความบนปุ่มคำอวยพร"
                value={form.wishButtonText}
                onChange={handleChange}
              />

              <input
                type="text"
                name="wishButtonTextEn"
                className="w-full px-3 py-2 border rounded"
                placeholder="Wish button text (EN)"
                value={form.wishButtonTextEn}
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
                แสดงปุ่ม "แนบสลิป"
              </label>

              <input
                type="text"
                name="slipButtonText"
                className="w-full px-3 py-2 border rounded"
                placeholder="ข้อความบนปุ่มแนบสลิป"
                value={form.slipButtonText}
                onChange={handleChange}
              />

              <input
                type="text"
                name="slipButtonTextEn"
                className="w-full px-3 py-2 border rounded"
                placeholder="Slip button text (EN)"
                value={form.slipButtonTextEn}
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
              แสดงปุ่ม "ดูรูป card อวยพรทั้งหมด"
            </label>

            <input
              type="text"
              name="viewWishesButtonText"
              className="w-full px-3 py-2 border rounded"
              placeholder="ข้อความบนปุ่มดูรูป card อวยพรทั้งหมด"
              value={form.viewWishesButtonText}
              onChange={handleChange}
            />

            <input
              type="text"
              name="viewWishesButtonTextEn"
              className="w-full px-3 py-2 border rounded"
              placeholder="View wishes button text (EN)"
              value={form.viewWishesButtonTextEn}
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

          {/* ตั้งค่าปุ่มเลือกฝ่าย */}
          <hr className="my-8" />
          <h3 className="text-lg font-semibold text-gray-700">
            ตั้งค่าปุ่มเลือกฝ่าย
          </h3>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-sm block mb-1">ข้อความฝ่ายเจ้าบ่าว</label>
              <input
                type="text"
                name="groom_label"
                value={form.groom_label}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="ฝ่ายเจ้าบ่าว"
              />
            </div>
            <div>
              <label className="text-sm block mb-1">ข้อความฝ่ายเจ้าสาว</label>
              <input
                type="text"
                name="bride_label"
                value={form.bride_label}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                placeholder="ฝ่ายเจ้าสาว"
              />
            </div>
          </div>
          <div>
            <label className="text-sm block mb-1">เลือกไอคอนฝ่ายเจ้าบ่าว</label>
            <div className="flex items-center gap-2">
              <select
                value={groomIconKey}
                onChange={e => {
                  setGroomIconKey(e.target.value);
                  setGroomIconFile(null);
                  setPreviewGroomIcon(null);
                }}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">-- เลือกไอคอน --</option>
                {iconImageOptions.map(opt => (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>
              <input
                type="file"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files[0];
                  setGroomIconFile(file);
                  setPreviewGroomIcon(file ? URL.createObjectURL(file) : null);
                }}
                className="w-full px-3 py-2 border rounded"
              />
              {groomIconFile ? (
                <img src={previewGroomIcon} alt="icon" className="w-8 h-8" />
              ) : groomIconKey ? (
                <img src={iconImageOptions.find(opt => opt.key === groomIconKey)?.src} alt="icon" className="w-8 h-8" />
              ) : null}
            </div>
          </div>

          <div>
            <label className="text-sm block mb-1">เลือกไอคอนฝ่ายเจ้าสาว</label>
            <div className="flex items-center gap-2">
              <select
                value={brideIconKey}
                onChange={e => {
                  setBrideIconKey(e.target.value);
                  setBrideIconFile(null);
                  setPreviewBrideIcon(null);
                }}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">-- เลือกไอคอน --</option>
                {iconImageOptions.map(opt => (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>
              <input
                type="file"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files[0];
                  setBrideIconFile(file);
                  setPreviewBrideIcon(file ? URL.createObjectURL(file) : null);
                }}
                className="w-full px-3 py-2 border rounded"
              />
              {brideIconFile ? (
                <img src={previewBrideIcon} alt="icon" className="w-8 h-8" />
              ) : brideIconKey ? (
                <img src={iconImageOptions.find(opt => opt.key === brideIconKey)?.src} alt="icon" className="w-8 h-8" />
              ) : null}
            </div>
          </div>

          {/* ตั้งค่าเลขพร้อมเพย์ */}
          <hr className="my-8" />
          <h3 className="text-lg font-semibold text-gray-700">
            ตั้งค่าเลขพร้อมเพย์
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            หมายเลขพร้อมเพย์สำหรับรับเงินโอนจากแขก
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">เลขพร้อมเพย์เจ้าบ่าว</label>
              <input
                type="text"
                name="promptpay_groom"
                value={form.promptpay_groom}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
                placeholder="เช่น 0812345678"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">เลขพร้อมเพย์เจ้าสาว</label>
              <input
                type="text"
                name="promptpay_bride"
                value={form.promptpay_bride}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded"
                placeholder="เช่น 0898765432"
              />
            </div>
          </div>

          {/* ตั้งค่าเลขบัญชีธนาคาร */}
          <hr className="my-8" />
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              name="showBankAccount"
              checked={form.showBankAccount}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <h3 className="text-lg font-semibold text-gray-700">
              แสดงข้อมูลบัญชีธนาคาร
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            ข้อมูลบัญชีธนาคารสำหรับรับเงินโอนจากแขก
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* ฝ่ายเจ้าบ่าว */}
            <div className="space-y-4 p-4 border rounded-lg bg-blue-50">
              <h4 className="font-medium text-blue-700">ข้อมูลบัญชีฝ่ายเจ้าบ่าว</h4>
              
              <div>
                <label className="block text-sm font-medium mb-1">ธนาคาร</label>
                <select
                  name="groom_bank"
                  value={form.groom_bank}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                >
                  <option value="">-- เลือกธนาคาร --</option>
                  {bankOptions.map(bank => (
                    <option key={bank.key} value={bank.key}>{bank.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">เลขบัญชี</label>
                <input
                  type="text"
                  name="groom_account_number"
                  value={form.groom_account_number}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="เช่น 123-4-56789-0"
                />
              </div>
              
                             <div>
                 <label className="block text-sm font-medium mb-1">ชื่อบัญชี</label>
                 <input
                   type="text"
                   name="groom_account_name"
                   value={form.groom_account_name}
                   onChange={handleChange}
                   className="w-full px-4 py-2 border rounded"
                   placeholder="เช่น นาย สมชาย ใจดี"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium mb-1">อัพโหลด QR Code</label>
                 <input
                   type="file"
                   accept="image/*"
                   onChange={handleGroomQRChange}
                   className="w-full px-4 py-2 border rounded"
                 />
                 {previewGroomQR && (
                   <div className="mt-3">
                     <img
                       src={previewGroomQR}
                       alt="Groom QR Code"
                       className="max-h-32 w-auto rounded-md shadow-md border"
                     />
                   </div>
                 )}
               </div>
             </div>

            {/* ฝ่ายเจ้าสาว */}
            <div className="space-y-4 p-4 border rounded-lg bg-pink-50">
              <h4 className="font-medium text-pink-700">ข้อมูลบัญชีฝ่ายเจ้าสาว</h4>
              
              <div>
                <label className="block text-sm font-medium mb-1">ธนาคาร</label>
                <select
                  name="bride_bank"
                  value={form.bride_bank}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                >
                  <option value="">-- เลือกธนาคาร --</option>
                  {bankOptions.map(bank => (
                    <option key={bank.key} value={bank.key}>{bank.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">เลขบัญชี</label>
                <input
                  type="text"
                  name="bride_account_number"
                  value={form.bride_account_number}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="เช่น 987-6-54321-0"
                />
              </div>
              
                             <div>
                 <label className="block text-sm font-medium mb-1">ชื่อบัญชี</label>
                 <input
                   type="text"
                   name="bride_account_name"
                   value={form.bride_account_name}
                   onChange={handleChange}
                   className="w-full px-4 py-2 border rounded"
                   placeholder="เช่น นางสาว สมหญิง ใจดี"
                 />
               </div>
               
               <div>
                 <label className="block text-sm font-medium mb-1">อัพโหลด QR Code</label>
                 <input
                   type="file"
                   accept="image/*"
                   onChange={handleBrideQRChange}
                   className="w-full px-4 py-2 border rounded"
                 />
                 {previewBrideQR && (
                   <div className="mt-3">
                     <img
                       src={previewBrideQR}
                       alt="Bride QR Code"
                       className="max-h-32 w-auto rounded-md shadow-md border"
                     />
                   </div>
                 )}
               </div>
             </div>
           </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">
              เลือกเทมเพลตที่ใช้ในงาน
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {templateOptions.map((tpl) => (
                <label
                  key={tpl.id}
                  className="flex items-center gap-2 text-sm border px-3 py-2 rounded shadow-sm"
                >
                  <input
                    type="checkbox"
                    checked={tpl.show_template}
                    onChange={(e) =>
                      setTemplateOptions((prev) =>
                        prev.map((t) =>
                          t.id === tpl.id
                            ? { ...t, show_template: e.target.checked }
                            : t
                        )
                      )
                    }
                  />
                  {tpl.name}
                </label>
              ))}
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
              {loading ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;
