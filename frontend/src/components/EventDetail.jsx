// components/EventDetail.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

function EventDetail() {
  const { eventId } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">รายละเอียดงาน: {eventId}</h1>
      <p className="mt-2 text-gray-600">
        (คุณสามารถโหลดข้อมูลจาก API หรือฐานข้อมูลได้ที่นี่โดยใช้ eventId)
      </p>
    </div>
  );
}

export default EventDetail;
