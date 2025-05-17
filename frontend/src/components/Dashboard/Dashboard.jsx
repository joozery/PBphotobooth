import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

function Dashboard() {
  const [selectedPage, setSelectedPage] = useState('');
  const navigate = useNavigate();

  // ✅ เช็กว่ามี auth ไหม ถ้าไม่ → กลับไป /admin/login
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin-auth');
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
  }, [navigate]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onSelectPage={setSelectedPage} selectedPage={selectedPage} />
      <MainContent selectedPage={selectedPage} onSelectPage={setSelectedPage} />

    </div>
  );
}

export default Dashboard;
