import React, { useState } from "react";
import { FaPenNib, FaReceipt } from "react-icons/fa";
import { MdTranslate } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import bgFlower from "../assets/bgflower.jpg";

export default function WeddingLanding() {
  const [lang, setLang] = useState("th");
  const navigate = useNavigate();

  const texts = {
    th: {
      weddingOf: "THE WEDDING OF",
      startWish: "เริ่มเขียนคำอวยพร",
      uploadSlip: "แนบสลิปพร้อมเพย์",
      day: "เสาร์",
      ceremony: "พิธีการ",
      at: "เวลา 00:00",
      month: "มี.ค.",
    },
    en: {
      weddingOf: "THE WEDDING OF",
      startWish: "Start Wishing",
      uploadSlip: "Upload PromptPay Slip",
      day: "SATURDAY",
      ceremony: "THE CEREMONY",
      at: "AT 00:00",
      month: "MAR",
    },
  };

  const t = texts[lang];

  return (
    <div className="w-screen h-screen flex items-center justify-center font-prompt bg-[#eee]">
      <div
        className="w-full max-w-sm h-[100svh] bg-cover bg-center bg-no-repeat flex flex-col justify-between relative shadow-xl rounded-none"
        style={{ backgroundImage: `url(${bgFlower})` }}
      >
        {/* 🌐 Language Switch */}
        <button
          onClick={() => setLang(lang === "th" ? "en" : "th")}
          className="absolute top-4 right-4 z-10 bg-white/90 px-2 py-1 rounded-full shadow text-sm flex items-center gap-1"
        >
          <MdTranslate className="text-lg" />
          {lang === "th" ? "EN" : "TH"}
        </button>

        {/* 📝 Main Content */}
        <div className="relative z-10 mt-32 px-6 text-center text-gray-800">
          <p className="text-xs tracking-wide">{t.weddingOf}</p>
          <h1 className="text-4xl font-[cursive] mt-2">Pancake</h1>
          <h2 className="text-4xl font-[cursive] -mt-2">& Keng</h2>

          <div className="mt-6 flex items-center justify-center gap-4 text-sm font-medium">
            <div className="border-t border-black w-12" />
            <span>{t.day}</span>
            <div className="border-t border-black w-12" />
          </div>

          <div className="my-2">
            <div className="text-xs">{t.month}</div>
            <div className="text-5xl font-bold">29</div>
            <div className="text-xs">2025</div>
          </div>

          <div className="flex items-center justify-center gap-4 text-sm font-medium">
            <div className="border-t border-black w-12" />
            <span>{t.at}</span>
            <div className="border-t border-black w-12" />
          </div>

          <div className="mt-6 text-[#8d6e63] text-lg font-medium tracking-wide">
            {t.ceremony}
          </div>
        </div>

        {/* 🔘 Action Buttons */}
        <div className="w-full px-6 mb-10 z-10 flex flex-col gap-3 bg-white/80 backdrop-blur-sm pt-4 pb-6">
          <button
            onClick={() => navigate("/wish")}
            className="w-full bg-blue-700 text-white py-3 rounded-full shadow-lg flex items-center justify-center gap-2 text-sm font-semibold"
          >
            <FaPenNib className="text-base" />
            {t.startWish}
          </button>
          <button className="w-full bg-white text-blue-700 border py-3 rounded-full shadow flex items-center justify-center gap-2 text-sm font-medium">
            <FaReceipt className="text-base" />
            {t.uploadSlip}
          </button>
        </div>
      </div>
    </div>
  );
}
