import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoading, Oval } from "@agney/react-loading";

export default function WishConfirm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { containerProps, indicatorEl } = useLoading({
    loading,
    indicator: <Oval width="24" />,
  });

  const image = localStorage.getItem("wishImage") || "/sample-image.png";
  const templateId = localStorage.getItem("templateId") || 1;
  const name = localStorage.getItem("wishName") || "เมย์";
  const message = localStorage.getItem("wishMessage") || "ยินดีด้วยนะ";

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("ส่งคำอวยพรเรียบร้อย!");
      navigate("/thankyou");
    }, 1500); // จำลองเวลาโหลด 1.5 วินาที
  };

  return (
    <div className="w-screen h-[100svh] bg-black text-white font-prompt flex flex-col justify-center items-center px-4">
      <div className="bg-white rounded-xl shadow overflow-hidden max-w-sm w-full relative">
        {/* Template ภาพพื้นหลัง */}
        <img
          src={`/template${templateId}.jpg`}
          alt="Card Template"
          className="w-full h-auto object-cover aspect-[4/3]"
        />

        {/* Overlay รูป */}
        <img
          src={image}
          alt="User Upload"
          className="absolute top-[20%] left-[10%] w-28 h-28 object-cover rounded-lg border-2 border-white shadow-md"
        />

        {/* ข้อความ */}
        <div className="absolute top-[25%] right-[10%] w-1/2 text-sm text-gray-800 text-right">
          <p className="leading-snug break-words">{message}</p>
          <p className="mt-2 font-semibold text-xs text-gray-500">– {name}</p>
        </div>
      </div>

      {/* ปุ่ม */}
      <div className="mt-6 w-full max-w-sm">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition flex justify-center items-center gap-2"
        >
          {loading ? (
            <span {...containerProps}>{indicatorEl}</span>
          ) : (
            <>ส่งคำอวยพร</>
          )}
        </button>
        <div
          className="mt-4 text-center text-sm underline cursor-pointer"
          onClick={() => navigate(-1)}
        >
          ยกเลิก
        </div>
      </div>
    </div>
  );
}
