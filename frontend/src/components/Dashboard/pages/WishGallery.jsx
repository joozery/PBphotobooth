import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaTrash, FaEye, FaDownload, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://72-60-43-104.sslip.io";

export default function WishGallery() {
  const { eventId } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [wishes, setWishes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWish, setSelectedWish] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSide, setFilterSide] = useState("all");
  const [filterShow, setFilterShow] = useState("all");

  // โหลด event ทั้งหมด
  useEffect(() => {
    if (!eventId) {
      loadEvents();
    }
  }, [eventId]);

  const loadEvents = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/events`);
      setEvents(res.data || []);
    } catch (err) {
      console.error("❌ โหลด events ผิดพลาด:", err);
    } finally {
      setLoading(false);
    }
  };

  // โหลด wishes ของ event เฉพาะ
  useEffect(() => {
    if (eventId) {
      loadEventWishes(eventId);
    }
  }, [eventId]);

  const loadEventWishes = async (id) => {
    try {
      setLoading(true);
      console.log("🔍 Loading event wishes for ID:", id);
      
      const [eventRes, wishesRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/events/${id}`),
        axios.get(`${BASE_URL}/api/wishes?eventId=${id}&showAll=true`) // ใช้ showAll=true เพื่อดูทั้งหมด
      ]);
      
      console.log("✅ Event data:", eventRes.data);
      console.log("✅ Wishes data:", wishesRes.data);
      console.log("✅ Wishes data length:", wishesRes.data?.length || 0);
      console.log("✅ First wish:", wishesRes.data?.[0]);
      
      setSelectedEvent(eventRes.data);
      
      // ตอนนี้ API จะส่งข้อมูลครบแล้ว ไม่ต้องแปลง
      if (Array.isArray(wishesRes.data)) {
        console.log("✅ Setting wishes:", wishesRes.data);
        setWishes(wishesRes.data);
      } else {
        console.log("❌ Wishes response is not an array:", wishesRes.data);
        setWishes([]);
      }
    } catch (err) {
      console.error("❌ โหลด wishes ผิดพลาด:", err);
      console.error("Error details:", err.response?.data || err.message);
      setWishes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWish = async (wishId) => {
    const result = await Swal.fire({
      title: 'ยืนยันการลบ',
      text: 'คุณต้องการลบคำอวยพรนี้ใช่หรือไม่?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
      try {
        console.log("🗑️ Deleting wish ID:", wishId);
        await axios.delete(`${BASE_URL}/api/wishes/${wishId}`);
        setWishes(wishes.filter(wish => wish.id !== wishId));
        console.log("✅ Wish deleted successfully");
        
        Swal.fire({
          title: 'ลบสำเร็จ!',
          text: 'คำอวยพรถูกลบเรียบร้อยแล้ว',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        console.error("❌ ลบ wish ผิดพลาด:", err);
        console.error("❌ Error response:", err.response?.data || err.message);
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          text: 'ไม่สามารถลบคำอวยพรได้',
          icon: 'error'
        });
      }
    }
  };

  const handleViewWish = (wish) => {
    setSelectedWish(wish);
    setModalOpen(true);
  };

  const handleDownloadWish = (wish) => {
    const link = document.createElement('a');
    link.href = wish.image_url;
    link.download = `wish-${wish.name || 'unknown'}.jpg`;
    link.click();
  };

  const handleEventClick = (event) => {
    loadEventWishes(event.id);
  };

  // Filter wishes based on search and filters
  const filteredWishes = wishes.filter(wish => {
    // เฉพาะ wish ที่มี image_url จริงเท่านั้น
    if (!wish.image_url || typeof wish.image_url !== 'string' || wish.image_url.trim() === '') return false;
    const matchesSearch = wish.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         wish.message?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSide = filterSide === "all" || wish.side === filterSide;
    const matchesShow = filterShow === "all" || 
                       (filterShow === "show" && wish.show_in_slideshow) ||
                       (filterShow === "hide" && !wish.show_in_slideshow);
    return matchesSearch && matchesSide && matchesShow;
  });

  // ไม่ใช้ FolderDetailDialog แล้ว เพราะเราใช้ UI ใหม่

  // กรณี /wish-gallery (ไม่มี eventId)
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">กำลังโหลด...</div>
      </div>
    );
  }

  // แสดงรายการ events
  if (!eventId && !selectedEvent) {
    return (
      <div className="font-prompt bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          📸 จัดการคำอวยพรทั้งหมด
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
              onClick={() => handleEventClick(event)}
            >
              <div className="relative">
                <img
                  src={event.cover_image}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {event.wish_count || 0} คำอวยพร
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {event.event_date ? new Date(event.event_date).toLocaleDateString('th-TH') : 'ไม่ระบุวันที่'}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {events.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">ยังไม่มีงานในระบบ</p>
          </div>
        )}
      </div>
    );
  }

  // แสดงรายการ wishes ของ event
  return (
    <div className="font-prompt bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              📸 คำอวยพร - {selectedEvent?.title}
            </h1>
            <p className="text-gray-600 mt-1">
              จำนวนทั้งหมด {wishes.length} คำอวยพร
            </p>
          </div>
                     <button
             onClick={() => {
               setSelectedEvent(null);
               setWishes([]);
               if (!eventId) loadEvents();
             }}
             className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
           >
             ← กลับ
           </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาชื่อหรือข้อความ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <select
            value={filterSide}
            onChange={(e) => setFilterSide(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">ทุกฝ่าย</option>
            <option value="groom">ฝ่ายเจ้าบ่าว</option>
            <option value="bride">ฝ่ายเจ้าสาว</option>
          </select>
          
          <select
            value={filterShow}
            onChange={(e) => setFilterShow(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">ทั้งหมด</option>
            <option value="show">แสดงในสไลด์</option>
            <option value="hide">ไม่แสดงในสไลด์</option>
          </select>
        </div>
      </div>

      {/* Wishes Grid */}
      <div className="p-6">
        {filteredWishes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">ไม่พบคำอวยพรที่ตรงกับเงื่อนไข</p>
            <div className="text-xs text-gray-400 mt-4 space-y-1">
              <div>API: {BASE_URL}/api/wishes?eventId={selectedEvent?.id}</div>
              <div>จำนวน wishes: {wishes.length}</div>
              <div>จำนวน filtered: {filteredWishes.length}</div>
              <div>Event ID: {selectedEvent?.id}</div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredWishes.map((wish) => (
              <div
                key={wish.id}
                className="relative group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
              >
                <div className="aspect-square relative">
                  {wish.image_url ? (
                    <img
                      src={wish.image_url}
                      alt={`คำอวยพรจาก ${wish.name}`}
                      className="w-full h-full object-cover"
                      onError={e => { e.target.onerror = null; e.target.style.display = 'none'; e.target.parentNode && (e.target.parentNode.innerHTML = '<div class=\'w-full h-full flex items-center justify-center text-gray-400 bg-gray-100\'>ไม่มีรูป</div>'); }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                      ไม่มีรูป
                    </div>
                  )}
                  
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 flex gap-2 transition-all duration-200">
                      <button
                        onClick={() => handleViewWish(wish)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg"
                        title="ดูรายละเอียด"
                      >
                        <FaEye size={14} />
                      </button>
                      <button
                        onClick={() => handleDownloadWish(wish)}
                        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-lg"
                        title="ดาวน์โหลด"
                      >
                        <FaDownload size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteWish(wish.id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg"
                        title="ลบ"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Status badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className={`text-xs px-2 py-1 rounded-full text-white font-medium ${
                      wish.side === 'groom' ? 'bg-blue-600' : 'bg-pink-600'
                    }`}>
                      {wish.side === 'groom' ? 'เจ้าบ่าว' : 'เจ้าสาว'}
                    </span>
                    {!wish.show_in_slideshow && (
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-600 text-white font-medium">
                        ไม่แสดง
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Name */}
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {wish.name || 'ไม่ระบุชื่อ'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {wish.created_at ? new Date(wish.created_at).toLocaleDateString('th-TH') : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for viewing wish details */}
      {modalOpen && selectedWish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">รายละเอียดคำอวยพร</h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedWish.image_url}
                    alt={`คำอวยพรจาก ${selectedWish.name}`}
                    className="w-full rounded-lg shadow-md"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ</label>
                    <p className="text-gray-900">{selectedWish.name || 'ไม่ระบุชื่อ'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ข้อความ</label>
                    <p className="text-gray-900">{selectedWish.message || 'ไม่มีข้อความ'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ฝ่าย</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium text-white ${
                      selectedWish.side === 'groom' ? 'bg-blue-600' : 'bg-pink-600'
                    }`}>
                      {selectedWish.side === 'groom' ? 'ฝ่ายเจ้าบ่าว' : 'ฝ่ายเจ้าสาว'}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">แสดงในสไลด์โชว์</label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      selectedWish.show_in_slideshow 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedWish.show_in_slideshow ? 'แสดง' : 'ไม่แสดง'}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">วันที่สร้าง</label>
                    <p className="text-gray-900">
                      {selectedWish.created_at 
                        ? new Date(selectedWish.created_at).toLocaleString('th-TH')
                        : 'ไม่ระบุ'
                      }
                    </p>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={() => handleDownloadWish(selectedWish)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium"
                    >
                      <FaDownload className="inline mr-2" />
                      ดาวน์โหลด
                    </button>
                    <button
                      onClick={() => {
                        setModalOpen(false);
                        handleDeleteWish(selectedWish.id);
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium"
                    >
                      <FaTrash className="inline mr-2" />
                      ลบ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
